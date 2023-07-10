import Builder from "#core/external-resources/builder";
import fetch from "#core/fetch";
import tar from "#core/tar";

const MAXMIND_ID = "GeoLite2-City",
    MAXMIND_LICENSE_KEY = process.env.MAXMIND_LICENSE_KEY,
    url = `https://download.maxmind.com/app/geoip_download?edition_id=${MAXMIND_ID}&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz`;

export default class TLD extends Builder {

    // properties
    get id () {
        return "softvisio-node/geoip-city/resources/geolite2-city";
    }

    // protected
    async _getEtag () {
        if ( !MAXMIND_LICENSE_KEY ) return result( [500, `Maxmind license key not found`] );

        return this._getLastModified( url );
    }

    async _build ( location ) {
        if ( !MAXMIND_LICENSE_KEY ) return result( [500, `Maxmind license key not found`] );

        const res = await fetch( url );

        // request error
        if ( !res.ok ) return res;

        // download and unpack
        await new Promise( resolve => {
            const writable = tar.extract( {
                "cwd": location,
                "filter": ( path, entry ) => path.endsWith( ".mmdb" ),
                "strip": 1,
            } );

            res.body.pipe( writable );

            writable.on( "end", resolve );
        } );

        return result( 200 );
    }
}
