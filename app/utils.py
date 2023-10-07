import time

# Function to format the time in HH:MM:SS format
def format_time(seconds):
    minutes, seconds = divmod(int(seconds), 60)
    hours, minutes = divmod(minutes, 60)
    return f"{hours:02}:{minutes:02}:{seconds:02}"

# Function to start the timer
def start_timer(session):
    session['timer_start_time'] = time.time()

# Function to stop the timer
def stop_timer(session):
    session.pop('timer_start_time', None)
