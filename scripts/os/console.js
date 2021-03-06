/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function CLIconsole() {
    // Properties
    this.CurrentFont      = _DefaultFontFamily;
    this.CurrentFontSize  = _DefaultFontSize;
    this.CurrentXPosition = 0;
    this.CurrentYPosition = _DefaultFontSize;
    this.buffer = "";
	this.prevBuffer = [];
    this.prevBufferPosition = 0;
	
    // Methods
    this.init = function() {
       this.clearScreen();
       this.resetXY();
    };

    this.clearScreen = function() {
       _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
    };

    this.resetXY = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition = this.CurrentFontSize;
    };

    this.handleInput = function() {
       while (_KernelInputQueue.getSize() > 0)
       {
           // Get the next character from the kernel input queue.
           var chr = _KernelInputQueue.dequeue();
           // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
           if (chr == String.fromCharCode(13))  //     Enter key
           {
               // The enter key marks the end of a console command, so ...
               // ... tell the shell ...
               _OsShell.handleInput(this.buffer);
			   this.prevBuffer.push(this.buffer);
			   this.prevBufferPosition = this.prevBuffer.length;
			   // ... and reset our buffer.
               this.buffer = "";
           }
		   else if (chr == String.fromCharCode(8))  //backspace
           {
		       if(this.buffer != "")				//originally did not have this if statement, and I am pretty sure I do not need it, but I was/am paranoia.
			   {
			       var currentCharacter = this.buffer.slice(-1);
			       this.buffer = this.buffer.slice(0,-1);
			       this.removeText(currentCharacter);   // "remove"
			   }
           }
		   else if (chr == String.fromCharCode(38))  //up arrow
		   {		   
			   if(this.buffer != "") 
			   {
			      while(this.buffer != "")
				  {
				      var currentCharacter = this.buffer.slice(-1);
					  this.buffer = this.buffer.slice(0,-1);
				      this.removeText(currentCharacter);   // "remove"
				  }
			   }
			   
			   if(this.prevBufferPosition > 0)
			   {
			      this.prevBufferPosition -= 1;
			   }
			   this.putText(this.prevBuffer[this.prevBufferPosition]);
			   this.buffer = this.prevBuffer[this.prevBufferPosition];   
           }
		   
		   else if (chr == String.fromCharCode(40))  //down arrow
		   {			   
			   if(this.buffer != "") 
			   {
			      while(this.buffer != "")
				  {
				      var currentCharacter = this.buffer.slice(-1);
					  this.buffer = this.buffer.slice(0,-1);
				      this.removeText(currentCharacter);   // "remove"
				  }
			   }
			   
			   if(this.prevBufferPosition < this.prevBuffer.length-1)  //I went back and forth on this. Lacking -1 makes sense, but I felt have the last command be retained seemed right.
			   {
			      this.prevBufferPosition += 1;
			   }
			   this.putText(this.prevBuffer[this.prevBufferPosition]);
			   this.buffer = this.prevBuffer[this.prevBufferPosition];   
           }
		   
		   else if (chr == String.fromCharCode(223))  //ampersand
		   {
			   this.putText('&');
			   this.buffer += '&';
		   }
		   
		   else if (chr == String.fromCharCode(224))  //left paren
		   {
			   this.putText('(');
			   this.buffer += '(';
		   }
           // TODO: Write a case for Ctrl-C.
           else
           {
               // This is a "normal" character, so ...
               // ... draw it on the screen...
               this.putText(chr);
               // ... and add it to our buffer.
               this.buffer += chr;
           }
       }
    };

    this.putText = function(text) {
       // My first inclination here was to write two functions: putChar() and putString().
       // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
       // between the two.  So rather than be like PHP and write two (or more) functions that
       // do the same thing, thereby encouraging confusion and decreasing readability, I
       // decided to write one function and use the term "text" to connote string or char.
       if (text !== "")
       {
			// Draw the text at the current X and Y coordinates.
			_DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);
			// Move the current X position.
			var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
			this.CurrentXPosition = this.CurrentXPosition + offset;
       }
    };
	
	this.removeText = function(text) {   //simply the opposite of put with illusions.
       if (text !== "")
       {
		   var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
           _DrawingContext.removeText(this.CurrentFont, this.CurrentFontSize, (this.CurrentXPosition-offset), this.CurrentYPosition, text);
           this.CurrentXPosition = this.CurrentXPosition - offset;
       }
    };
	
    this.advanceLine = function() {
		this.CurrentXPosition = 0;
        this.CurrentYPosition += _DefaultFontSize + _FontHeightMargin; 
		if(this.CurrentYPosition >= _Canvas.height)
		{   
			var offset = _DefaultFontSize + _FontHeightMargin;
			var currentCanvas = _DrawingContext.getImageData(0, offset, _Canvas.width, (_Canvas.height - offset));  //"takes" a pixel by pixel image of the current canvas with an offset to account for scroll.
			_StdIn.clearScreen();                                                                                   //clears the screen
			_DrawingContext.putImageData(currentCanvas, 0, 0);                                                      //redraws
			this.CurrentYPosition -= offset;                                                                        //sets the y
		}
    };
}