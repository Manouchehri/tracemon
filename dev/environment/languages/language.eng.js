/**
 * Created by mcandela on 23/01/14.
 */


define([], function(){
    return {
        latency: "Latency",
        traceroutesDontReach: "Some traceroutes don't reach the target",
        allTraceroutesDontReach: "All the traceroutes don't reach the target",
        title: "Traceroute Route Visualisation",
        hostGroupedBy: "Hosts grouped by",

        labelOptions: {
          ip: "IP address",
          reverseLookup: "Reverse lookup",
          country: "Country code"
        },

        views: {
            host: "IP",
            asn: "Autonomous System",
            country: "Country"
        }
    }
});