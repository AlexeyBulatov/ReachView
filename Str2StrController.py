# ReachView code is placed under the GPL license.
# Written by Egor Fedorov (egor.fedorov@emlid.com)
# Copyright (c) 2015, Emlid Limited
# All rights reserved.

# If you are interested in using ReachView code as a part of a
# closed source project, please contact Emlid Limited (info@emlid.com).

# This file is part of ReachView.

# ReachView is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# ReachView is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with ReachView.  If not, see <http://www.gnu.org/licenses/>.

import pexpect
from glob import glob

# This module automates working with STR2STR software

class Str2StrController:

    def __init__(self, str2str_path = None, gps_cmd_file_path = None):

        if str2str_path is None:
            self.bin_path = "/home/reach/RTKLIB/app/str2str/gcc"
        else:
            self.bin_path = str2str_path

        if gps_cmd_file_path is None:
            self.gps_cmd_file_path = "/home/reach/RTKLIB/app/rtkrcv/"
        else:
            self.gps_cmd_file_path = gps_cmd_file_path

        self.available_gps_cmd_files = [""]
        self.updateAvailableCommandFiles()

        if "GPS_5Hz" in self.available_gps_cmd_files:
            self.gps_cmd_file = "GPS_5Hz"
        else:
            if self.available_gps_cmd_files:
                self.gps_cmd_file = self.available_gps_cmd_files[0]

        self.child = 0
        self.started = False

        # port settings are kept as class properties:
        self.input_stream = "tcpcli://localhost:3000#ubx"
        self.output_stream = "tcpsvr://:9000#rtcm3"

        # Reach defaults for base position and rtcm3 messages:
        self.rtcm3_messages = ["1002", "1006", "1013", "1019"]
        self.base_position = [] # lat, lon, height

    def updateAvailableCommandFiles(self):
        # get all the cmd files from command file path

        # clear previous state
        self.gps_cmd_file = [""]

        path_length = len(self.gps_cmd_file_path)

        files = glob(self.gps_cmd_file_path + "*.cmd")

        for cmd_file in files:
            self.available_gps_cmd_files.append(cmd_file[path_length:-4])

    def formCommandFileCommentString(self):
        # form a parseable comment string containing available cmd files
        # we always have the "empty" option
        string = ""

        for index, cmd_file in enumerate(self.available_gps_cmd_files):
            string += str(index) + ":" + cmd_file + ","

        return "(" + string[:-1] + ")"


    def readConfig(self):
        parameters_to_send = {}

        parameters_to_send["0"] = {"parameter": "outstr-path", "value": self.output_stream, "description": "Output path for corrections"}

        parameters_to_send["1"] = {"parameter": "rtcm3_out_messages", "value": ",".join(self.rtcm3_messages), "description": "RTCM3 messages for output"}

        # if we don't have a set base position we want to send empty strings
        if not self.base_position:
            base_pos = ["", "", ""]
        else:
            base_pos = self.base_position

        parameters_to_send["2"] = {"parameter": "base_pos_lat", "value": base_pos[0], "description": "Base latitude"}
        parameters_to_send["3"] = {"parameter": "base_pos_lon", "value": base_pos[1], "description": "Base longitude"}
        parameters_to_send["4"] = {"parameter": "base_pos_height", "value": base_pos[2], "description": "Base height"}

        parameters_to_send["5"] = {
            "parameter": "gps_cmd_file",
            "value": self.gps_cmd_file[len(self.gps_cmd_file_path):-4],
            "description": "u-blox configuration file",
            "comment": self.formCommandFileCommentString()
        }

        return parameters_to_send

    def writeConfig(self, parameters_received):

        coordinate_filled_flag = 3
        base_pos = []

        self.output_stream = parameters_received["0"]["value"]

        # llh
        self.base_position = []

        self.base_position.append(parameters_received["2"]["value"])
        self.base_position.append(parameters_received["3"]["value"])
        self.base_position.append(parameters_received["4"]["value"])

        # check for empty coordinate values
        # if at least one is empty, the list should be empty too
        if len(filter(bool, self.base_position)) != 3:
            self.base_position = []

        if parameters_received["5"]["value"]:
            # if its not empty, we use full path
            self.gps_cmd_file = self.gps_cmd_file_path + parameters_received["5"]["value"] + ".cmd"
        else:
            self.gps_cmd_file = ""

        self.rtcm3_messages = parameters_received["1"]["value"].split(",")

    def start(self, rtcm3_messages = None, base_position = None, gps_cmd_file = None):
        # when we start str2str we also have 3 important optional parameters
        # 1. rtcm3 message types. We have standard 1002, 1006, 1013, 1019 by default
        # 2. base position in llh. By default we don't pass any values, however it is best to use this feature
        # 3. gps cmd file will take care of msg frequency and msg types
        # To pass parameters to this function use string lists, like ["1002", "1006"] or ["60", "30", "100"]

        print(self.bin_path)

        if not self.started:
            if rtcm3_messages is None:
                rtcm3_messages = self.rtcm3_messages

            if base_position is None:
                base_position = self.base_position

            if gps_cmd_file is None:
                gps_cmd_file = self.gps_cmd_file

            cmd = "/str2str -in " + self.input_stream + " -out " + self.output_stream + " -msg " + ",".join(rtcm3_messages)

            if "" in base_position:
                base_position = []

            if base_position:
                cmd += " -p " + " ".join(base_position)

            if gps_cmd_file:
                cmd += " -c " + gps_cmd_file

            cmd = self.bin_path + cmd
            print("Starting str2str with")
            print(cmd)

            self.child = pexpect.spawn(cmd, cwd = self.bin_path, echo = False)

            a = self.child.expect(["stream server start", pexpect.EOF, "error"])
            # check if we encountered any errors launching str2str
            if a == 1:
                print("got EOF while waiting for stream start. Shutting down")
                print("This means something went wrong and str2str just stopped")
                print("output before exception: " + str(self.child))
                return -1

            if a == 2:
                print("Could not start str2str. Please check path to binary or parameters, like serial port")
                print("You may also check serial, tcp, ntrip ports for availability")
                return -2

            # if we are here, everything is good
            self.started = True
            return 1

        # str2str already started
        return 2

    def stop(self):
        # terminate the stream

        if self.started:
            if self.child.terminate():
                self.started = False
                return 1
            else:
                # something went wrong
                print("Could not terminate str2str")
                return -1

        # str2str already stopped
        return 2
