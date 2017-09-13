# This software records the mouse position and button click information

import pythoncom
import pyHook
import wx
import thread
import time
import win32gui
import win32con
import os

def MouseHook(threadName):
    # Start the com, loop forever
    pythoncom.PumpMessages()

def FrequencyControl(threadName):
    # determine the recording frequency
    while True:
        time.sleep(0.02) # 50 Hz
        global log_flag
        log_flag = True

def OnButtonClick(event):
    global current_time
    current_time = time.time()
    # set the toggle button activity
    if Button.GetValue():
        print current_time,"-1 -1 -1";
        file_object.write(str(current_time) + " -1 -1 -1\n");
        Button.SetLabel('End')
        hm.HookMouse()
    else:
        print current_time,"-2 -2 -2";
        file_object.write(str(current_time) + " -2 -2 -2\n");
        Button.SetLabel('Start')
        hm.UnhookMouse()

def OnMouseButtons(event):
    # called when mouse button events are received
    # print 'MessageName:', event.MessageName, 'Message:', event.Message
    # print 'Time:', event.Time
    # print 'WindowName:', event.WindowName, 'Window:', event.Window
    # print 'Position:', event.Position, 'Wheel:', event.Wheel
    # print '---'
    global time_stamp, current_time
    current_time = time.time()
    if event.Message == 513:
        file_object.write(str(current_time) + " " + str(event.Position[0]) + " " + str(
            event.Position[1]) + " " + "1 \n")
        print current_time, event.Position[0], event.Position[1], 1
    if event.Message == 514:
        file_object.write(str(current_time) + " " + str(event.Position[0]) + " " + str(
            event.Position[1]) + " " + "2 \n")
        print current_time, event.Position[0], event.Position[1], 2
    if event.Message == 516:
        file_object.write(str(current_time) + " " + str(event.Position[0]) + " " + str(
            event.Position[1]) + " " + "3 \n")
        print current_time, event.Position[0], event.Position[1], 3
    if event.Message == 517:
        file_object.write(str(current_time) + " " + str(event.Position[0]) + " " + str(
            event.Position[1]) + " " + "4 \n")
        print current_time, event.Position[0], event.Position[1], 4
    time_stamp = current_time
    return True

def OnMouseMove(event):
    # called when mouse move events are received
    global log_flag, time_stamp, current_time
    if log_flag:
        current_time = time.time()
        file_object.write(str(current_time)+" "+str(event.Position[0])+" "+str(event.Position[1])+" "+"0 \n")
        print current_time, event.Position[0], event.Position[1], 0
        log_flag = False
        time_stamp = current_time
    # return True to pass the event to other handlers
    return True


# Global variables
log_flag = False
launch_time = time.time()
time_stamp = launch_time  # last time stamp
current_time = launch_time


# Open a file
file_object = open("data/log_"+str(int(launch_time))+".txt", "w")
file_object.write("# Message code: 0 - Mouse move, 1 - Left button down\n# 2 - Left button up, 3 - Right button down, 4 - Right button up\n")
file_object.write("# -1 - Start, -2 - End\n#\n")
file_object.write("#("+str(launch_time)+") "+time.asctime(time.localtime(launch_time))+"\n")
file_object.write("#Time #X_pos #Y_pos #Message\n")
print "# Message code: 0 - Mouse move, 1 - Left button down\n# 2 - Left button up, 3 - Right button down, 4 - Right button up"
print "# -1 - Start, -2 - End\n"
print "#("+str(launch_time)+") "+time.asctime(time.localtime(launch_time))
print "#Time #X_pos #Y_pos #Message"

# Create a hook manager
hm = pyHook.HookManager()
# watch for  mouse events
hm.MouseAllButtons = OnMouseButtons
hm.MouseMove = OnMouseMove

# Start the thread for mouse hook
thread.start_new_thread(MouseHook, ("",))
# Start the thread to control the frequency of logging
thread.start_new_thread(FrequencyControl, ("",))



# Create the GUI
app = wx.App()
window = wx.Frame(None, size=(170, 90), title="",
                  style=wx.BORDER_RAISED | wx.MINIMIZE_BOX | wx.SYSTEM_MENU | wx.CAPTION |	 wx.CLOSE_BOX)
panel = wx.Panel(window)
# Create two buttons
Button = wx.ToggleButton(panel, label='Start', pos=(21, 6), size=(120, 50))
# Bind the buttons to functions
Button.Bind(wx.EVT_TOGGLEBUTTON, OnButtonClick)
window.Show(True)

# Minimize unnecessary windows
while (win32gui.FindWindow(None, u"pMouseApp") == 0):
	continue;
time.sleep(0.5)
win32gui.ShowWindow(win32gui.FindWindow(None, u"Windows PowerShell"), win32con.SW_MINIMIZE)
win32gui.ShowWindow(win32gui.FindWindow(None, u"pMouseApp"), win32con.SW_MINIMIZE)


# Run the GUI
app.MainLoop()
os.system("taskkill /im electron.exe")

