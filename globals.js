/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS
//
var APP_NAME = "CATos";
var APP_VERSION = "3.23-Gac"; 			//versions increment alphabetically by fruit
										//Apple uses cats for OSX, this is a CATos, so the first version (0.01) 
										//was Apple, and I decided in Ubuntu-like fashion to go alphabetically.
										// fruit gotten from http://en.wikipedia.org/wiki/List_of_culinary_fruits

var CPU_CLOCK_INTERVAL = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                    // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;
var FILESYSTEM_IRQ = 2;   

var QUANTUM = 6;
//
// Global Variables
//
var _CPU = null;
var _Memory = null;
var _HardDrive = null;
var _OSclock = 0;       // Page 23.
//var pcb = null; for testing

var _Canvas = null;               // Initialized in hostInit().
var _DrawingContext = null;       // Initialized in hostInit().
var _DefaultFontFamily = "sans";  // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;        // Additional space added to font size when advancing a line.

// Default the OS trace to be on.
var _Trace = true;

// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

var _KernelResidentList = null;
var _KernelReadyQueue = null;	  // considered using a normal array, but figured with an actual queue implemented, it would be better just to use this.
// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console = null;
var _OsShell = null;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;
var krnFileSystemDDriver = null;

// For testing...
var _GLaDOS = null;

var _CurrentPCB = 0;
var _PartitionSize = 256;
var _processFlag = 0;
var _RunAllFlag = 0;
var _ContextSwitch = 1;

//outputting code globals
var _TotalLines = 99;
var _LineBreak1 = 1;
var _LineBreak2 = 34;
var _LineBreak3 = 67;
var _MaxCellCount = 8;

//file system globals
var _MaxDisks = 1;
var _MaxTracks = 4;
var _MaxSectors = 8;
var _MaxBlocks = 8;
var _MaxBytes = 64;

var _FileSize = _MaxBytes - 4;
var _FileDenote = _MaxBytes - 60;

var response = true;

var formatFlag = 0; //mainly to handle the tab still being open, as the session is maintained.

//globals for tsb key manipulation
var _BlockRangeLower = 4;
var _BlockRangeUpper = 5;

var _SectorRangeLower = 2;
var _SectorRangeUpper = 3;