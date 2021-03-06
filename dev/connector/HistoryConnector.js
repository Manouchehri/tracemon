/**
 * Copyright 2014 - mcandela
 * Date: 25/11/14
 * Time: 14:49
 */

define([
    "tracemon.env.config",
    "tracemon.env.utils",
    "tracemon.lib.jquery-amd",
    "tracemon.lib.moment"
], function(config, utils, $, moment) {

    var HistoryConnector = function (env) {
        var hostsResolutionByIp, geolocByIp, neighboursByAsn, probesInfo, measurementInfo;

        hostsResolutionByIp = {};
        geolocByIp = {};
        neighboursByAsn = {};
        probesInfo = {};
        measurementInfo = {};

        this.getMeasurementResults = function (measurementId, options) {
            var queryParams;

            if (!options.startDate || !options.stopDate){
                throw 400;
            }

            queryParams = {
                start: options.startDate.unix(),
                stop: options.stopDate.unix(),
                include: []
            };

            if (env.preloadGeolocations){
                queryParams.include.push("geo");
            }

            if (env.bypassApiCache){
                queryParams.force = 1;
            }

            if (options.sources) {
                queryParams.probes = options.sources.join(',');
            }

            queryParams.include = queryParams.include.join(",");

            return $.ajax({
                dataType: "jsonp",
                async: true,
                cache: false,
                timeout: config.ajaxTimeout,
                url: env.dataApiResults.replace("0000", measurementId),
                data: queryParams,
                error: function () {
                    utils.observer.publish("error", {
                        type: 408,
                        message: config.errors[408]
                    });
                }
            });
        };

        this.getMeasurementInfo = function (measurementId){

            if (!measurementInfo[measurementId]){
                measurementInfo[measurementId] =  $.ajax({
                    type: 'GET',
                    async: true,
                    dataType: "jsonp",
                    cache: false,
                    timeout: config.ajaxTimeout,
                    url: env.dataApiMetadata.replace("0000", measurementId),
                    error: function () {
                        utils.observer.publish("error", {
                            type: 408,
                            message: config.errors[408]
                        });
                    }
                });
            }

            return measurementInfo[measurementId];
        };


        this.getHostReverseDns = function (ip) {

            if (!hostsResolutionByIp[ip]) {
                hostsResolutionByIp[ip] = $.ajax({
                    dataType: "jsonp",
                    cache: false,
                    async: true,
                    timeout: config.ajaxTimeout,
                    url: env.dataApiReverseDns,
                    data: {
                        resource: ip
                    },
                    error: function () {
                        utils.observer.publish("error", {
                            type: 408,
                            message: config.errors[408]
                        });
                    }
                });
            }

            return hostsResolutionByIp[ip];
        };


        this.getGeolocation = function (ip) {

            if (!geolocByIp[ip]) {
                geolocByIp[ip] = $.ajax({
                    dataType: "jsonp",
                    cache: false,
                    async: true,
                    timeout: config.ajaxTimeout,
                    url: env.dataApiGeolocation,
                    data: {
                        resource: ip,
                        resources: ip
                    },
                    error: function () {
                        utils.observer.publish("error", {
                            type: "408",
                            message: config.errors["408"]
                        });
                    }
                });
            }

            return geolocByIp[ip];
        };


        this.getNeighbours = function (asn) {

            if (!neighboursByAsn[asn]) {
                neighboursByAsn[asn] = $.ajax({
                    dataType: "jsonp",
                    cache: false,
                    async: true,
                    timeout: config.ajaxTimeout,
                    url: env.dataApiAsnNeighbours,
                    data: {
                        resource: asn
                    },
                    error: function () {
                        utils.observer.publish("error", {
                            type: "408",
                            message: config.errors["408"]
                        });
                    }
                });
            }

            return neighboursByAsn[asn];
        };

        this.getProbesInfo = function(measurementId){

            if (measurementInfo[measurementId]){
                return measurementInfo[measurementId]; // It's the same API, it may change in the future
            }

            if (!probesInfo[measurementId]){
                probesInfo[measurementId] = $.ajax({
                    dataType: "jsonp",
                    cache: false,
                    async: true,
                    timeout: config.ajaxTimeout,
                    url: env.dataApiMetadata.replace("0000", measurementId),
                    data: {
                        type: "jsonp"
                    },
                    error: function () {
                        utils.observer.publish("error", {
                            type: 408,
                            message: config.errors[408]
                        });
                    }
                });

            }

            return probesInfo[measurementId];
        };


    };

    return HistoryConnector;

});

