/* ------------------------------
   PCB.js
   
   The "base class" (or 'prototype') for all Process Control Blocks.
   ------------------------------ */
//it would probably be better to put these in globals.js, but I felt as they are directly involved in pid process, they should be here. 
//var pcbCount = 1;
var pid = 0;
var programCount = 0;
var _MaxProgram = 3;
function PCB()
{
	this.pid		= 0;  		// Process ID
	this.base		= 0;  		// Base Address in main Memory
	this.limit		= _PartitionSize - 1;		// Max Address in main Memory
	this.block		= 1;	    // Block in main Memory
	this.state		= "new";
	this.priority 	= 0;
	this.location 	= "memory";
	
	this.acc	= 0;
	this.xReg	= 0;
	this.yReg	= 0;
	this.zFlag	= 0;
	this.pc		= 0;
	
	this.pcbInit = function(i, priority) {
		this.pid		= i;  														// Process ID
		this.base		= 0 + ((this.pid) * _PartitionSize);  						// Base Address in main Memory, creates an offset based on ones already in queue, though issues after 3 realistically.
		this.limit		= _PartitionSize - 1 + ((this.pid) * _PartitionSize);		// Max Address in main Memory, creates an offset based on ones already in queue, though issues after 3 realistically.
		this.block		= this.pid + 1;	 											// Block in main Memory
		this.state		= "ready";
		if(priority.toString().length !== 0 && !isNaN(priority))
		{
			//alert("meow");
			this.priority = priority;
		}
		if(this.block > _MaxProgram)
		{
			this.location = "disk";
			this.base = 0;
			this.limit = 0;
			//alert(this.location);
		}
		//alert(this.location);
		
		this.acc	= 0;
		this.xReg	= 0;
		this.yReg	= 0;
		this.zFlag	= 0;
		this.pc		= 0;
		//alert(priority);
		//alert(this.priority);
	}
	
	this.statusUp = function(state, pc, acc, x, y, z)       //status update for the pcb
	{
		this.state 		= state;
		this.pc	  		= pc;
		this.acc  		= acc;
		this.xReg     	= x;
		this.yReg     	= y;
		this.zFlag     	= z;
	}
	
	this.pcbMemoryFill = function(startFlag) { //for updating the current memory block on the client
		// var table = document.getElementById("PCBTable");  //modifies the pcb table by adding a row, based on the number of rows, and inserts the values directly.
		// if(startFlag === 1)
			// document.getElementById("PCBTable").deleteRow(-1);
		// //for(var i = 0; i <= pid; 
		
		// var row = table.insertRow(-1);
		// var cellPID = row.insertCell(0);
		// var cellPC = row.insertCell(1);
		// var cellACC = row.insertCell(2);
		// var cellXReg = row.insertCell(3);
		// var cellYReg = row.insertCell(4);
		// var cellZFlag = row.insertCell(5);
	
		// cellPID.innerHTML = this.pid;
		// cellPC.innerHTML = this.pc;
		// cellACC.innerHTML = this.acc;
		// cellXReg.innerHTML = this.xReg;
		// cellYReg.innerHTML = this.yReg;
		// cellZFlag.innerHTML = this.zFlag;
		//attempt at a better solution, which in the long run, did the same thing, though, could be used* if properly fixed (*I think.)
		var divPIDFill = document.getElementById("divPID_PCB");
		divPIDFill.innerText = divPIDFill.textContent = this.pid;
		var divPCFill = document.getElementById("divPC_PCB");
		divPCFill.innerText = divPCFill.textContent = toHexString(this.pc);
		var divACCFill = document.getElementById("divACC_PCB");
		divACCFill.innerText = divACCFill.textContent = this.acc;
		var divXRegFill = document.getElementById("divXReg_PCB");
		divXRegFill.innerText = divXRegFill.textContent = this.xReg;
		var divYRegFill = document.getElementById("divYReg_PCB");
		divYRegFill.innerText = divYRegFill.textContent = this.yReg;
		var divZFlagFill = document.getElementById("divZFlag_PCB");
		divZFlagFill.innerText = divZFlagFill.textContent = this.zFlag;
		var divStateFill = document.getElementById("divState_PCB");
		divStateFill.innerText = divStateFill.textContent = this.state;
	}
	
	// this.toString = function() {
		// var output = "";
		// output += "PID: " + this.pid;
		// output += "; Base: " + this.base;
		// output += "; Limit: " + this.limit;
		// output += "; State: " + this.state;
		// return output;
	// }
	
	this.toString = function() { //Admittedly not perfect. There were many issues with printing spaces for some reason, so it was either this or iffy table manipulation.
		var output = "";
		var meow = " ---- "; //necessary
		var meow1 = " ----- "; //not as necessary
		var meow2 = " -------- ";
		// output += " [ ";
		// output += meow;
		output += "-- " + this.pid;
		//output += meow1;
		if(this.base < 100)
			output += meow2;
		else
			output += meow1;
		output += " " + this.base;
		output += meow1;
		output += " " + this.limit;
		output += meow1;
		output += " " + this.block;
		output += meow;
		if(this.state !== "terminated")
			output += " " + this.state;
		else
			output += " " + "dead";
		output += meow;
		output += " " + this.location;
		// output += meow;
		// output += " ] ";
		//alert(output);
		return output;
	}
	
	this.rollInUpdate = function(oldProcess)       //status update for the pcb
	{
		this.location	= oldProcess.location;
		this.base  		= oldProcess.base;
		this.limit 		= oldProcess.limit;
	}
	
	this.rollOutUpdate = function()       //status update for the pcb
	{
		this.location	= "disk";
		this.base  		= 0;
		this.limit 		= 0;
	}
}
