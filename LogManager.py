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
import math
from glob import glob

from log_converter import convbin

class LogManager():

    def __init__(self, rtklib_path, log_path):

        self.log_path = log_path
        self.convbin = convbin.Convbin(rtklib_path)

        self.available_logs = []
        self.updateAvailableLogs()

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
                log_size = "{0:.2f}".format(log_size)


                potential_zip_path = os.path.splitext(log)[0] + ".zip"

                log_format = "LOL"
                if os.path.isfile(potential_zip_path):
                    log_format = "RINEX"
                else:
                    if log_name.endswith("ubx"):
                        log_format = "UBX"
                    elif log_name.endswith("rtcm3"):
                        log_format = "RTCM3"

                self.available_logs.append({
                    "name": log_name,
                    "size": log_size,
                    "format": log_format
                })

        self.available_logs.sort(key = lambda log: log["name"][4:], reverse = True)

    def formTimeString(self, seconds):
        # form a x minutes y seconds string from seconds
        m, s = divmod(seconds, 60)

        s = math.ceil(s)

        format_string = "{0:.0f} minutes " if m > 0 else ""
        format_string += "{1:.0f} seconds"

        return format_string.format(m, s)

    def calculateConversionTime(self, log_path):
        # calculate time to convert based on log size and format
        log_size = os.path.getsize(log_path) / (1024*1024.0)
        conversion_time = 0

        if log_path.endswith("rtcm3"):
            conversion_time = 24 * log_size
        elif log_path.endswith("ubx"):
            conversion_time = 1.2 * log_size

        return "{:.0f}".format(conversion_time)

    def deleteLog(self, log_filename):
        # try to delete log if it exists

        log_name, extension = os.path.splitext(log_filename)

        # try to delete raw log
        print("Deleting log" + log_name + extension)
        try:
            os.remove(self.log_path + "/" + log_name + extension)
        except OSError, e:
            print ("Error: " + e.filename + " - " + e.strerror)

        print("Deleting log" + log_name + ".zip")
        try:
            os.remove(self.log_path + "/" + log_name + ".zip")
        except OSError, e:
            print ("Error: " + e.filename + " - " + e.strerror)


