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

import os
from glob import glob

from log_converter import convbin

class LogManager():

    def __init__(self, rtklib_path, log_path):

        self.log_path = log_path
        self.convbin = convbin.Convbin(rtklib_path)

        self.available_logs = []

        self.rinex_logs = []
        self.updateAvailableLogs()

    def processNewLogs(self):

        print("Processing new logs!!!")

        raw_rover_logs = glob(self.log_path + "/*.ubx")
        raw_base_logs = glob(self.log_path + "/*.rtcm3")

        raw_logs_paths = raw_base_logs + raw_rover_logs

        print(raw_logs_paths)

        for log_path in raw_logs_paths:
            log = self.convbin.convertRTKLIBLogToRINEX(log_path)
            print("Conversion result == " + str(log))

            if log is not None:
                log.createLogPackage()

    def updateAvailableLogs(self):

        # clean previous values
        self.available_logs = []

        # get a list of available .log files in the log directory
        full_path_logs = glob(self.log_path + "/*.rtcm3") + glob(self.log_path + "/*.ubx")

        for log in full_path_logs:
            if log:
                # if the entry is not empty, we get file name, size and prepare them for use in templates

                log_name = os.path.basename(log)
                # get size in bytes and convert to MB
                log_size = os.path.getsize(log) / (1024*1024.0)
                log_size = str(log_size)
                right_border = log_size.find(".") + 2
                log_size = log_size[:right_border]

                self.available_logs.append({
                    "name": log_name,
                    "size": log_size
                })

        self.available_logs.sort(key = lambda log: log["name"][4:], reverse = True)

    def deleteLog(self, log_name):
        # try to delete log if it exists

        try:
            os.remove(self.log_path + "/" + log_name)
        except OSError, e:
            print ("Error: " + e.filename + " - " + e.strerror)





