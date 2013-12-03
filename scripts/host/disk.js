//disk.js
//implementation of the File System, to be dealt with by deviceDriverFileSystem.js

function FileSystem()
{
    this.disk    	= sessionStorage;   //personally though Session Storage made more sense than Local
    this.tracks     = _MaxTracks;  		//no magic numbers here!
    this.sectors    = _MaxSectors;
    this.blocks     = _MaxBlocks;
    this.bytes 		= _MaxBytes;
}
