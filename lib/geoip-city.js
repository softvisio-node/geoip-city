import fs from "node:fs";
import CacheLru from "#core/cache/lru";
import externalResources from "#core/external-resources";
import MMDB from "#core/mmdb";

const cache = new CacheLru( { "maxSize": 1000 } );

var mmdb;

const resource = await externalResources
    .add( "softvisio-node/core/resources/geolite2-city" )
    .on( "update", () => ( mmdb = null ) )
    .check();

class GeoipCity {
    constructor () {}

    // public
    get ( ipAddress ) {
        mmdb ??= new MMDB( fs.readFileSync( resource.location + "/GeoLite2-City.mmdb" ), { cache } );

        return mmdb.get( ipAddress );
    }
}

export default new GeoipCity();
