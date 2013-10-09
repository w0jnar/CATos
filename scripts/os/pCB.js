/* ------------------------------
   PCB.js
   
   The "base class" (or 'prototype') for all Process Control Blocks.
   ------------------------------ */

function PCB()
{
	this.pID		= pid;  		// Process ID
	this.base		= spaceBase;  	// Base Address in main Memory
	this.limit		= spaceMax;		// Max Address in main Memory
	this.block		= block;	    // Block in main Memory

	this.acc	= 0;
	this.x		= 0;
	this.y		= 0;
	this.z		= 0;
	this.pc		= pc;	
}
