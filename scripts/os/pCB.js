/* ------------------------------
   PCB.js
   
   The "base class" (or 'prototype') for all Process Control Blocks.
   ------------------------------ */
//it would probably be better to put these in globals.js, but I felt as they are directly involved in pid process, they should be here. 
var pcbCount = 1;
var pid = 0;
   
function PCB()
{
	this.pid		= 0;  		// Process ID
	this.base		= 0;  		// Base Address in main Memory
	this.limit		= 255;		// Max Address in main Memory
	this.block		= 1;	    // Block in main Memory
	this.state		= "new";
	
	this.acc	= 0;
	this.xReg	= 0;
	this.yReg	= 0;
	this.zReg	= 0;
	this.pc		= 0;
	
	this.pcbInit = function() {
		this.pid		= pid++;  							// Process ID
		this.base		= 0 + ((pcbCount-1) * 256);  		// Base Address in main Memory, creates an offset based on ones already in queue, though issues after 3 realistically.
		this.limit		= 255 + ((pcbCount-1) * 256);		// Max Address in main Memory, creates an offset based on ones already in queue, though issues after 3 realistically.
		this.block		= pcbCount++;	 					// Block in main Memory
		this.state		= "ready";
		
		this.acc	= 0;
		this.xReg	= 0;
		this.yReg	= 0;
		this.zReg	= 0;
		this.pc		= 0;
	}
	
	this.pcbMemoryFill = function() { //for updating the current memory block on the client
		var divPIDFill = document.getElementById("divPID_PCB");
		divPIDFill.innerText = divPIDFill.textContent = this.pid;
		var divPCFill = document.getElementById("divPC_PCB");
		divPCFill.innerText = divPCFill.textContent = this.pc;
		var divACCFill = document.getElementById("divACC_PCB");
		divACCFill.innerText = divACCFill.textContent = this.acc;
		var divXRegFill = document.getElementById("divXReg_PCB");
		divXRegFill.innerText = divXRegFill.textContent = this.xReg;
		var divYRegFill = document.getElementById("divYReg_PCB");
		divYRegFill.innerText = divYRegFill.textContent = this.yReg;
		var divZFlagFill = document.getElementById("divZFlag_PCB");
		divZFlagFill.innerText = divZFlagFill.textContent = this.zReg;
	}
	
	this.toString = function() {
		var output = "";
		output += "PID: " + this.pid;
		output += ", base: " + this.base;
		output += ", limit: " + this.limit;
		output += ", block: " + this.block;
		
		return output;
	}
}

