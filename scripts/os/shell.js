/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit() {
    var sc = null;
    //
    // Load the command list.

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;
    
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;
    
    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS abruptly.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;
    
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;

	// date
    sc = new ShellCommand();
    sc.command = "date";
    sc.description = "- Displays the current date and time.";
    sc.function = shellDate;
    this.commandList[this.commandList.length] = sc;
	
	// location
    sc = new ShellCommand();
    sc.command = "whereami";
    sc.description = "- Displays the current location.";
    sc.function = shellLocation;
    this.commandList[this.commandList.length] = sc;
	
	// Schrödinger
    sc = new ShellCommand();
    sc.command = "schrodinger";
    sc.description = "- Returns a random number of random integers from 7 to 42."; //got rid of the whole, "up to 20" mainly seeing as it did not fit and because the most I have seen in testing has been 5.
    sc.function = shellSchrodinger;
    this.commandList[this.commandList.length] = sc;
	
	// status
    sc = new ShellCommand();
    sc.command = "status";
    sc.description = "- <string> Displays the user string in status box.";
    sc.function = shellStatus;
    this.commandList[this.commandList.length] = sc;
	
	// BSOD
	sc = new ShellCommand();
    sc.command = "bsod";   //admittedly unoriginal, but it gets the point across.
    sc.description = "- Kills the OS.";
    sc.function = shellFail;
    this.commandList[this.commandList.length] = sc;
	
	// load
	sc = new ShellCommand();
    sc.command = "load"; 
    sc.description = "- Checks user code for errors.";
    sc.function = shellLoad;
    this.commandList[this.commandList.length] = sc;
	
	// run
	sc = new ShellCommand();
    sc.command = "run"; 
    sc.description = "- <PID> Runs user input code based on PID.";
    sc.function = shellRun;
    this.commandList[this.commandList.length] = sc;
	
	// runAll
	sc = new ShellCommand();
    sc.command = "runall"; 
    sc.description = "- Runs all of the loaded programs.";
    sc.function = shellRunAll;
    this.commandList[this.commandList.length] = sc;
	
	// quantum
	sc = new ShellCommand();
    sc.command = "quantum"; 
    sc.description = "- <int> Set the cycle quantum for Round Robin.";
    sc.function = shellQuantum;
    this.commandList[this.commandList.length] = sc;
	
	// display
	sc = new ShellCommand();
    sc.command = "active"; 
    sc.description = "- Displays all active PIDs.";
    sc.function = shellDisplay;
    this.commandList[this.commandList.length] = sc;
	
	// kill
	sc = new ShellCommand();
    sc.command = "kill"; 
    sc.description = "- <int> Kills a process based on input PID.";
    sc.function = shellKill;
    this.commandList[this.commandList.length] = sc;
	
	// Program 1
	sc = new ShellCommand();
    sc.command = "program1";   //admittedly unoriginal, but it gets the point across.
    sc.description = "- Puts an example program into the \"User Input Program\" area.";
    sc.function = shellProgram1;
    this.commandList[this.commandList.length] = sc;
	
	// Program 2 (Alan's requested program)
	sc = new ShellCommand();
    sc.command = "program_alan";   //admittedly unoriginal, but it gets the point across.
    sc.description = "- Puts an Alan designed, Thomas implemented program.";
    sc.function = shellProgram2;
    this.commandList[this.commandList.length] = sc;
	
    // processes - list the running processes and their IDs
    // kill <id> - kills the specified process id.

    //
    // Display the initial prompt.
    this.putPrompt();
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    // 
    // Parse the input...
    //
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // JavaScript may not support associative arrays in all browsers so we have to
    // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            var fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for apologies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
    }
}

function shellParseInput(buffer)
{
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 2. Lower-case it.
    buffer = buffer.toLowerCase();

    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args)
{
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately), 
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect JavaScript, we'd be
// able to make then private.  (Actually, we can. have a look at Crockford's stuff and Resig's JavaScript Ninja cook.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()     
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
    _StdIn.putText("Invalid Command. ");
    if (_SarcasticMode)
    {
        _StdIn.putText("Duh. Go back to your Speak & Spell.");
    }
    else
    {
        _StdIn.putText("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch.");
    _SarcasticMode = true;
}

function shellApology()
{
   if (_SarcasticMode) {
      _StdIn.putText("Okay. I forgive you. This time.");
      _SarcasticMode = false;
   } else {
      _StdIn.putText("For what?");
   }
}

function shellVer(args)
{
    _StdIn.putText(APP_NAME + " version " + APP_VERSION);    
}

function shellHelp(args)
{
    _StdIn.putText("Commands:");
    for (var i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }    
}

function shellShutdown(args)
{
     _StdIn.putText("Shutting down...");
     // Call Kernel shutdown routine.
    krnShutdown();   
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help": 
                _StdIn.putText("Help displays a list of (hopefully) valid commands.");
                break;
            default:
                _StdIn.putText("No manual entry for " + args[0] + ".");
        }        
    }
    else
    {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on": 
                if (_Trace && _SarcasticMode)
                {
                    _StdIn.putText("Trace is already on, dumbass.");
                }
                else
                {
                    _Trace = true;
                    _StdIn.putText("Trace ON");
                }
                
                break;
            case "off": 
                _Trace = false;
                _StdIn.putText("Trace OFF");                
                break;                
            default:
                _StdIn.putText("Invalid arguement.  Usage: trace <on | off>.");
        }        
    }
    else
    {
        _StdIn.putText("Usage: trace <on | off>");
    }
}

function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.putText(args.join(' ') + " = '" + rot13(args.join(' ')) +"'");     // Requires Utils.js for rot13() function.
    }
    else
    {
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}

//Date function
function shellDate()  //Probably should have separated this and put it in utils.js, but it did not seem right to me.
{
	function fixer(num) 	//Fixes issues of not having zeros in front of dates.
	{
			if (num < 10)
			{
				num = '0' + num;
			}
			return num;
	}

	var timedate = new Date();
	var day = timedate.getDay();
	var date = timedate.getDate();
	var month = timedate.getMonth()+1;
	var year = timedate.getFullYear();
	var hours = timedate.getHours();
	var minutes = timedate.getMinutes();
	var seconds = timedate.getSeconds();

	if (hours < 10) 	//Thought it would be more interesting for those who dislike Military time, though I am not sure why anyone would dislike it.
	{
		var ampm = "AM";
	}
	else if (hours > 10 && hours < 12)
	{
		var ampm = "AM";
	}
	else if (hours == 12)
	{
		var ampm = "PM";
	}
	else
	{
		hours = hours - 12;
		var ampm = "PM";
	}
	
	switch (day)	//Day of the week seemed useful.
	{
	case 0:
		var dayText = "Sunday";
		break;
	case 1:
		var dayText = "Monday";
		break;
	case 2:
		var dayText = "Tuesday";
		break;
	case 3:
		var dayText = "Wednesday";
		break;
	case 4:
		var dayText = "Thursday";
		break;
	case 5:
		var dayText = "Friday";
		break;
	case 6:
		var dayText = "Saturday";
		break;
	}

	_StdIn.putText('The current time and date are as follows: '    //hope you do not mind the date formatting, it is just persoanlly, I prefer day/month/year.
	+ fixer(hours) + ':' + fixer(minutes) + ':' + fixer(seconds)
	+ ' ' + ampm);
	_StdIn.advanceLine();
	_StdIn.putText('on ' + dayText + ', ' + fixer(date) + '/'
	+ fixer(month) + '/' + year);
}

function shellLocation()  //displays random locations, seemed like a good idea.
{
    var latitude = parseFloat((Math.random() * (180) + (-90)).toFixed(5));
	var longitude = parseFloat((Math.random() * (360) + (-180)).toFixed(5));
	
	_StdIn.putText("Latitude: " + latitude
	+ " Longitude: " + longitude);
}

function shellSchrodinger()  //_c@ has some great programming structures. (I do like random things.)
{
	function Schrodinger()
	{
		var cat = Math.floor(Math.random() * 2);
		if (cat == 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
    var numStore = new Array();
	while(Schrodinger() && numStore.length < 20)  //current record for furthest it has gone: 5 numbers.
	{
		numStore.push(Math.floor(Math.random() * (42 - 7 +1)) + 7);
	}
	for(var i = 0; i < numStore.length; i++)
	{
		if(numStore[i] < 10)
		{
			numStore[i] = '0' + numStore[i];
		}
	}
	if (numStore.length == 0)  //Mainly because in the chances (I mean, there is a 50% chance) of no numbers being printed, some kind of output seemed better than a broken looking function.
	{
		_StdIn.putText("Sorry, no numbers!");
	}
	else
	{
		_StdIn.putText(numStore.join(', '));
	}
}

function shellStatus(args)  //displays the status the user enters
{
	var statusFill = document.getElementById("status");
	statusFill.innerText = statusFill.textContent = args.join(' ');  //for browser safety
}

function shellFail() //BSOD
{
	krnTrapError("LOLMEOW");  //What? Cats are fun.
}

function shellLoad() //Load
{
	var inCode = document.getElementById("taProgramInput").value.replace(/\s+/g, '').toUpperCase(); //admittedly messy, but seemingly for the best.
	var test = inCode.match(/^([0-9A-F ])*$/gm);
	var sizeTest = inCode.length <= (_PartitionSize * 2);
//	alert(inCode);
	if((test != null) && (inCode.length % 2 == 0) && (inCode !== "") && (programCount < _MaxProgram) && sizeTest)  //only real issue is new line, though it seemed unnecessary (and to a degree impossible*) as the user program input automatically scrolls. (*I honestly doubt it is impossible, it just felt that way.)
	{   //logic is to test that it is proper 2 byte hex code.
//		_StdIn.putText(inCode);  test lines
//		_StdIn.advanceLine();
		var process = krnMemoryAllocation(inCode);
		_StdIn.putText("Program Loaded. Program has a PID of " + process.pid + ".");
		_StdIn.advanceLine();
		//_StdIn.putText(process.toString());
	}
	else if(programCount === _MaxProgram)
	{
		_StdIn.putText("Attempted to load too many programs.");
		_StdIn.advanceLine();
		_StdIn.putText("No more memory can be allocated at this time.");
	}
	else if(inCode.length % 2 !== 0)
	{
		_StdIn.putText("Program attempted to be loaded was off.");
		_StdIn.advanceLine();
		_StdIn.putText("Please check your input code.");
	}
	else if(!sizeTest)
	{
		_StdIn.putText("Program attempted to be loaded was too large.");
		_StdIn.advanceLine();
		_StdIn.putText("Please check the number and dial again.");
	}
	else
	{
		_StdIn.putText("Input Failed");
	}
}

function shellRun(args) //Run
{
    var inPID = parseInt(args);	//more or less note to self: never make similarly named globals for all of the things. It makes testing awful.
	if(inPID >= 0 && inPID < programCount)
	{
		krnRunProcess(inPID);
		
	}
    else
    {
		_StdOut.putText("PID not supplied or incorrect.");
    }
}

function shellRunAll() //Run
{
	_RunAllFlag = 1;
    krnRunAllProcesses();
}

function shellQuantum(args)
{
	//alert(QUANTUM);
	var inQuantum = parseInt(args);
	
	if( isNaN(inQuantum) || inQuantum < 0 )
	{
		_StdIn.putText("Invalid Quantum.");
	}
	else
	{
		QUANTUM = inQuantum;
		_StdIn.putText("Quantum Changed.");
	}
	//alert(QUANTUM);
}

function shellDisplay()
{
	var outputStr = "Current Active Processes: ";
	var outPIDs = [];
	for (var i in _KernelReadyQueue.q)
	{
		//alert("meow");
		//alert(_KernelReadyQueue.q[i].pid);
		if(_KernelReadyQueue.q[i].state !== "terminated")
		{
			//outputStr += _KernelReadyQueue.q[i].pid + " ";
			outPIDs.push(_KernelReadyQueue.q[i].pid);
		}
	}
	outPIDs.sort(function(a,b){return a - b}); //sorts them as they could be out of order
	outputStr += outPIDs.join(" "); //adds them to the string to print
	//alert(outputStr);
	_StdIn.putText(outputStr);
}

function shellKill(args)
{
	_CurrentPCB = -1;
	for(var i=0; i < _KernelReadyQueue.q.length; i++)  //goes through the ready queue looking for the process based on PID
    {
		//goes pcb by pcb
		if(_KernelReadyQueue.q[i] !== null)
		{
			if(args == parseInt(_KernelReadyQueue.q[i].pid))
			{
				_CurrentPCB = i;
			}
		}
    }
	if(_CurrentPCB === -1)  //if it was not found, error out.
	{
		_StdIn.putText("Error, process not found.");
	}
	else
	{
		//alert(_CurrentPCB);
		if(_KernelReadyQueue.q[0].pid !== _KernelReadyQueue.q[_CurrentPCB].pid) //check if it is the active process
		{
			var currentPID = _KernelReadyQueue.q[0].pid; //maintain the state
			var toBeRemoved = _KernelReadyQueue.q[_CurrentPCB];
			//alert("meow1");
			while(_KernelReadyQueue.q[0].pid !== toBeRemoved.pid) //get the one to be removed to the top
			{
				_KernelReadyQueue.enqueue(_KernelReadyQueue.q[0]);
				_KernelReadyQueue.dequeue();
			}
			//alert(_KernelReadyQueue.q[0].pid);
			//alert(_CurrentPCB);
			_KernelReadyQueue.dequeue(); //remove the program to be removed
			//alert("meow2");
			while(_KernelReadyQueue.q[0].pid !== currentPID) //reset
			{
			//alert(_KernelReadyQueue.q[0].pid);
			//alert(currentPID);
				_KernelReadyQueue.enqueue(_KernelReadyQueue.q[0]);
				_KernelReadyQueue.dequeue();
			}
			//alert("meow3");
		}
		else
		{
		}
		
		_StdIn.putText("Process decimated.");
		programCount--;
	}
}

function shellProgram1() //Program1
{
	var taUserProgamFill = document.getElementById("taProgramInput");
	taUserProgamFill.value = "A9 03 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 FF EE 40 00 AE 40 00 EC 41 00 D0 EF A9 44 8D 42 00 A9 4F 8D 43 00 A9 4E 8D 44 00 A9 45 8D 45 00 A9 00 8D 46 00 A2 02 A0 42 FF 00";
	_StdOut.putText("User Program Changed.");
}

function shellProgram2() //Program2
{
	var taUserProgamFill = document.getElementById("taProgramInput");
	taUserProgamFill.value = "A9 A9 A2 A9 EC 10 00 8D 10 00 EE 08 00 D0 F8 00 00";
	_StdOut.putText("User Program Changed.");
}