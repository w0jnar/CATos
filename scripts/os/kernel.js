/* ------------
   Kernel.js
   
   Requires globals.js
   
   Routines for the Operating System, NOT the host.
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */


//
// OS Startup and Shutdown Routines   
//
function krnBootstrap()      // Page 8.
{
   hostLog("bootstrap", "host");  // Use hostLog because we ALWAYS want this, even if _Trace is off.

   // Initialize our global queues.
   _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).
   _KernelBuffers = new Array();         // Buffers... for the kernel.
   _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.
   _KernelResidentList = new Array();
   for(var i = 0; i < _MaxProgram; i++)
   {
		_KernelResidentList[i] = null;
   }
   _KernelReadyQueue = new Queue();  	 // A queue for new PCB's (Process Control Blocks).
   
   _Console = new CLIconsole();          // The command line interface / console I/O device.

   // Initialize the CLIconsole.
   _Console.init();

   // Initialize standard input and output to the _Console.
   _StdIn  = _Console;
   _StdOut = _Console;

   // Load the Keyboard Device Driver
   krnTrace("Loading the keyboard device driver.");
   krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.  TODO: Should that have a _global-style name?
   krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
   krnTrace(krnKeyboardDriver.status);

   //
   // ... more?
   //

   // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
   krnTrace("Enabling the interrupts.");
   krnEnableInterrupts();

   // Launch the shell.
   krnTrace("Creating and Launching the shell.");
   _OsShell = new Shell();
   _OsShell.init();
   // Finally, initiate testing.
   if (_GLaDOS) {
      _GLaDOS.afterStartup();
   }
}

function krnShutdown()
{
    krnTrace("begin shutdown OS");
    // TODO: Check for running processes.  Alert if there are some, alert and stop.  Else...    
    // ... Disable the Interrupts.
    krnTrace("Disabling the interrupts.");
    krnDisableInterrupts();
    // 
    // Unload the Device Drivers?
    // More?
    //
	document.getElementById("btnHaltOS").disabled = true;
    krnTrace("end shutdown OS");
	clearInterval(_hardwareClockID);
}


function krnOnCPUClockPulse() 
{
    /* This gets called from the host hardware sim every time there is a hardware clock pulse.
       This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
       This, on the other hand, is the clock pulse from the hardware (or host) that tells the kernel 
       that it has to look for interrupts and process them if it finds any.                           */
	
	
	dateFunc();
	mainMemoryFill();
	
	
    // Check for an interrupt, are any. Page 560
    if (_KernelInterruptQueue.getSize() > 0)    
    {
        // Process the first interrupt on the interrupt queue.
        // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
        var interrupt = _KernelInterruptQueue.dequeue();
        krnInterruptHandler(interrupt.irq, interrupt.params);
    }
    else if (_CPU.isExecuting) // If there are no interrupts then run one CPU cycle if there is anything being processed.
    {
        _CPU.cycle();
		//mainMemoryFill();
		cpuMemoryFill();
    }    
    else                       // If there are no interrupts and there is nothing being executed then just be idle.
    {
       krnTrace("Idle");
    }
}


// 
// Interrupt Handling
// 
function krnEnableInterrupts()
{
    // Keyboard
    hostEnableKeyboardInterrupt();
    // Put more here.
}

function krnDisableInterrupts()
{
    // Keyboard
    hostDisableKeyboardInterrupt();
    // Put more here.
}

function krnInterruptHandler(irq, params)    // This is the Interrupt Handler Routine.  Pages 8 and 560.
{
    // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on.  Page 766.
    krnTrace("Handling IRQ~" + irq);

    // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
    // TODO: Consider using an Interrupt Vector in the future.
    // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.  
    //       Maybe the hardware simulation will grow to support/require that in the future.
    switch (irq)
    {
        case TIMER_IRQ: 
            krnTimerISR();                   // Kernel built-in routine for timers (not the clock).
            break;
        case KEYBOARD_IRQ: 
            krnKeyboardDriver.isr(params);   // Kernel mode device driver
            _StdIn.handleInput();
            break;
        default: 
            krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
    }
}

function krnTimerISR()  // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver).
{
    // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
}   



//
// System Calls... that generate software interrupts via tha Application Programming Interface library routines.
//
// Some ideas:
// - ReadConsole
// - WriteConsole
// - CreateProcess
// - ExitProcess
// - WaitForProcessToExit
// - CreateFile
// - OpenFile
// - ReadFile
// - WriteFile
// - CloseFile


//
// OS Utility Routines
//
function krnTrace(msg)
{
   // Check globals to see if trace is set ON.  If so, then (maybe) log the message. 
   if (_Trace)
   {
      if (msg === "Idle")
      {
         // We can't log every idle clock pulse because it would lag the browser very quickly.
         if (_OSclock % 10 == 0)  // Check the CPU_CLOCK_INTERVAL in globals.js for an 
         {                        // idea of the tick rate and adjust this line accordingly.
            hostLog(msg, "OS");
         }         
      }
      else
      {
       hostLog(msg, "OS");
      }
   }
}
   
function krnTrapError(msg)
{
    hostLog("OS ERROR - TRAP: " + msg);
	
	var console = document.getElementById('display');
	var bsodConsole = console.getContext('2d');

	var bsodImage = new Image();
	bsodImage.onload = function()
	{
		bsodConsole.drawImage(bsodImage, 0, 0, bsodImage.width, bsodImage.height);
	}
	bsodImage.src = 'images/bsod.png';  //works mostly how I would like, though must manually empty the cache each time I change the image.
    // TODO: Display error on console, perhaps in some sort of colored screen. (Perhaps blue?)
    krnShutdown();
}

function krnMemoryAllocation(inCode)
{
	var process = new PCB();  //creates new pcb
	var newProcessLocation;
	for(var i = 0; i < _MaxProgram; i++) //find a free space, not the best method for now, but seemed ok.
	{
		if(_KernelResidentList[i] === null)
		{
			newProcessLocation = i;
			break;
		}
	}
	//if(newProcessLocation == null) should be an impossibility with former checking, so for now removed
	
	process.pcbInit(newProcessLocation);
	_KernelResidentList[newProcessLocation] = process;
	programCount++;
	if(_processFlag === 0)
	{
		process.pcbMemoryFill(0);
		_processFlag = 1;
	}
	else
		process.pcbMemoryFill(1);
	mainMemoryRewrite(process.base, process.limit);
	mainMemoryUpdate(inCode, process.block);  //future-proofing for when there is more than one program for the memory on the "client."
	return process;
}

function krnRunProcess(inPID)
{
	var process;
	//	_StdIn.putText("Meow");
	//alert(_KernelResidentList.length);
	for(var i=0; i < _KernelResidentList.length; i++)  //goes through the ready queue looking for the process based on PID
    {
		//goes pcb by pcb
		if(_KernelResidentList[i] !== null)
		{
			if( inPID == parseInt(_KernelResidentList[i].pid))
			{
				_StdIn.putText("Process found!");  //is found
				_CurrentPCB = i;
			}
		}
    }
	if(_KernelResidentList[_CurrentPCB] == null)  //if it was not found, error out.
	{
		_StdIn.putText("Error, process not found.");
	}
	else    //else, set status (state), reset the cpu if it has old data, set cpu to executing.
	{
		_KernelReadyQueue.enqueue(_KernelResidentList[_CurrentPCB]);
		//_KernelResidentList.splice(_CurrentPCB, 1);
		_KernelResidentList[_CurrentPCB] = null;
		cpuMemoryReset();
		cpuMemoryFill();
		_KernelReadyQueue.q[0].statusUp("running", 0, 0, 0, 0, 0);
		_KernelReadyQueue.q[0].pcbMemoryFill(1);
		_CPU.PC = 0 + ((_KernelReadyQueue.q[0].pid) * _PartitionSize);
		memoryRanges(_KernelReadyQueue.q[0]); 
		_CPU.isExecuting = true;
	}
}

function mainMemoryFill(){
	var fill = mainMemoryInitString();
	var programTA = document.getElementById("taMemory");
	programTA.value = fill;
}


function mainMemoryInitString()  //creates a string of the mainMemoroy array to be printed to the index. 
{
	var current = 0;
	var stringReturn;
//	hexString = current.toString(16);
//	current = parseInt(hexString, 16);
	var j = 0; //column count more or less
	var currentBlock = 1;
	for(var i = 0; i <= 99; i++)
	{
		if(i == 0)
		{
			stringReturn = "                     Memory                     \n";
		}
		else if((i === 1) || (i === 34) || (i === 67))
		{
			stringReturn += "                    Program " + currentBlock + "                \n";
			currentBlock++;
		}
		else
		{
			stringReturn += " " + toHexString(j) + " | ";
			for(var cellCount = 0; cellCount < 8; cellCount++)   //realistically could have probably used j here or changed the variables, but for my own sake, this just helped me.
			{
				stringReturn += _Memory.mainMemory[j++] + " | ";
			}
			stringReturn += "|\n";
		}
	}
	return stringReturn;
}

function krnRunAllProcesses()
{
	for(var i=0; i< _KernelResidentList.length; i++)  //goes through the ready queue looking for the process based on PID
    {
		//goes pcb by pcb
        if(_KernelResidentList[i].status == "ready")
        {
			_KernelReadyQueue.enqueue(_KernelResidentList[i]);
			_KernelResidentList[i] = null;
        }
    }
	if(_KernelResidentList[_CurrentPCB] == null)  //if it was not found, error out.
	{
		_StdIn.putText("Error, process not found.");
	}
	else    //else, set status (state), reset the cpu if it has old data, set cpu to executing.
	{
		_KernelReadyQueue.enqueue(_KernelResidentList[_CurrentPCB]);
		_KernelResidentList[_CurrentPCB] = null;
		cpuMemoryReset();
		cpuMemoryFill();
		_KernelReadyQueue.q[_CurrentPCB].statusUp("running", 0, 0, 0, 0, 0);
		_KernelReadyQueue.q[_CurrentPCB].pcbMemoryFill(1);
		_CPU.PC = 0 + ((_KernelReadyQueue.q[_CurrentPCB].pid) * _PartitionSize);
		memoryRanges(_KernelReadyQueue.q[_CurrentPCB]); 
		_CPU.isExecuting = true;
	}
}