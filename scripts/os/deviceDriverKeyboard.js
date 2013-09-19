/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnKbdDispatchKeyPress(params)
{
    // Parse the params.    TODO: Check that they are valid and osTrapError if not.
    var keyCode = params[0];
    var isShifted = params[1];
    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";
    // Check to see if we even want to deal with the key that was pressed.
	if ((keyCode == null) ||
		(typeof keyCode !== "number"))
	{
		krnTrapError("Error: Corrupted Keyboard Driver");   //valid testing, clearly.
	}
    else if ((keyCode >= 65) && (keyCode <= 90))   // a..z (Keys seem not to come in as captials anyway)
    {
        // Determine the character we want to display.  
        // Assume it's lowercase...
        chr = String.fromCharCode(keyCode + 32);
        // ... then check the shift key and re-adjust if necessary.
        if (isShifted)
        {
            chr = String.fromCharCode(keyCode);
        }
        // TODO: Check for caps-lock and handle as shifted if so.
        _KernelInputQueue.enqueue(chr);        
    }    
    else if (  (keyCode == 32)                     ||   // space
               (keyCode == 13)                     ||   //enter
			   (keyCode == 38)                     ||   //up arrow
			   (keyCode == 8) )                         //backspace 
    {
        chr = String.fromCharCode(keyCode);
        _KernelInputQueue.enqueue(chr); 
    }
	else if ((keyCode >= 48) && (keyCode <= 57))        //numbers and their shifts
	{
		if (isShifted)
		{
			switch (keyCode)
			{
			case 48: //zero
				var keyCode = 41;
				break;
			case 49: //one
				var keyCode = 33;
				break;
			case 50: //two
				var keyCode = 64;
				break;
			case 51: //three
				var keyCode = 35;
				break;
			case 52: //four
				var keyCode = 36;
				break;
			case 53: //five
				var keyCode = 37;
				break;	
			case 54: //six
				var keyCode = 94;
				break;
			case 55: //seven
				var keyCode = 38;
				break;
			case 56: //eight
				var keyCode = 42;
				break;
			case 57: //nine
				var keyCode = 40;
				break;
			}
		}
		chr = String.fromCharCode(keyCode);
		_KernelInputQueue.enqueue(chr); 
	}
	else if (((keyCode >= 186) && (keyCode <= 192)) ||    
		 	 ((keyCode >= 219) && (keyCode <= 222)))     //everything else (seems somewhat pointless to separate, but I felt it was sort of necessary)
	{
		switch (keyCode)
		{
		case 192: //tilde
			if (isShifted)
			{
				var keyCode = 126;
			}
			else
			{
				var keyCode = 96;
			}
			break;
		case 189: //hyphen
			if (isShifted)
			{
				var keyCode = 95;
			}
			else
			{
				var keyCode = 45;
			}
			break;
		case 187: //equal
			if (isShifted)
			{
				var keyCode = 43;
			}
			else
			{
				var keyCode = 61;
			}
			break;
		case 219: //left bracket
			if (isShifted)
			{
				var keyCode = 123;
			}
			else
			{
				var keyCode = 91;
			}
			break;
		case 221: //right bracket
			if (isShifted)
			{
				var keyCode = 125;
			}
			else
			{
				var keyCode = 93;
			}
			break;
		case 220: //slash
			if (isShifted)
			{
				var keyCode = 124;
			}
			else
			{
				var keyCode = 92;
			}
			break;
		case 186: //semi-colon
			if (isShifted)
			{
				var keyCode = 58;
			}
			else
			{
				var keyCode = 59;
			}
			break;
		case 222: //left-single quote
			if (isShifted)
			{
				var keyCode = 34;
			}
			else
			{
				var keyCode = 39;
			}
			break;
		case 188: //comma
			if (isShifted)
			{
				var keyCode = 60;
			}
			else
			{
				var keyCode = 44;
			}
			break;
		case 190: //period
			if (isShifted)
			{
				var keyCode = 62;
			}
			else
			{
				var keyCode = 46;
			}
			break;
		case 191: //forward slash
			if (isShifted)
			{
				var keyCode = 63;
			}
			else
			{
				var keyCode = 47;
			}
			break;
		}
	chr = String.fromCharCode(keyCode);
	_KernelInputQueue.enqueue(chr); 
	}
	else  //this simple ignores invalid keys, in the sense that if you press an unsupported key, 
	{	  //it does not do anything, whereas if you were to press an arrow which is not supported, 
		  //it does not print the character associated with the keyCode	
	}
}
