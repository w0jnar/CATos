//disk.js
//implementation of the File System, to be dealt with by deviceDriverFileSystem.js

function FileSystem()
{
    this.disk    	= sessionStorage;   //personally thought Session Storage made more sense than Local
    this.tracks     = _MaxTracks;  		//no magic numbers here!
    this.sectors    = _MaxSectors;
    this.blocks     = _MaxBlocks;
    this.bytes 		= _MaxBytes;
}


//					,:/+/-
//					/M/              .,-=;//;-
//			   .:/= ;MH/,    ,=/+%$XH@MM#@:
//			  -$##@+$###@H@MMM#######H:.    -/H#
//		 .,H@H@ X######@ -H#####@+-     -+H###@X
//		  .,@##H;      +XM##M/,     =%@###@X;-
//		X%-  :M##########$.    .:%M###@%:
//		M##H,   +H@@@$/-.  ,;$M###@%,          -
//		M####M=,,---,.-%%H####M$:          ,+@##
//		@##################@/.         :%H##@$-
//		M###############H,         ;HM##M$=
//		#################.    .=$M##M$=
//		################H..;XM##M$=          .:+
//		M###################@%=           =+@MH%
//		@################M/.          =+H#X%=
//		=+M##############M,       -/X#X+;.
//		  .;XM##########H=    ,/X#H+:,
//			 .=+HM######M+/+HM@+=.
//				 ,:/%XM####H/.
//					  ,.:=-.