( function ( root, factory )
{
    if ( typeof define === "function" && define.amd )
    {
        define(factory);
    }
    else if ( typeof exports === "object" )
    {
        module.exports = factory();
    }
    else
    {
        root.Elo = factory();
    }
}( this, function ()
{
/* esnext true */
/* exported Elo */

var OUTCOMES =
{
    lost    : 0,
    tied    : 0.5,
    won     : 1
};

// This is some magical constant used by the ELO system form wikipedia
var PERF = 400;
var DEFAULT_KFACTOR = 32;

// http://en.wikipedia.org/wiki/Elo_rating_system#Most_accurate_K-factor
var DEFAULT_KFACTORS = function( rating )
{
    if ( rating <= 2100 )
    {
        return DEFAULT_KFACTOR;
    }
    else if ( 2100 < rating && rating <= 2400 )
    {
        return 24;
    }
    else if ( 2400 < rating )
    {
        return 16;
    }
};


var Elo = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
    function Elo( kFactor, min, max )
    {
        this.setKFactor( kFactor );
        this.minimum = typeof min !== 'undefined' ? min : -Infinity;
        this.maximum = typeof max !== 'undefined' ? max : Infinity;
    }DP$0(Elo,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    proto$0.getKFactor = function( rating )
    {
        if ( !isNaN( this.kFactor ) )
        {
            return this.kFactor;
        }

        return DEFAULT_KFACTORS( rating || 0 );
    };


    proto$0.getMin = function()
    {
        return this.minimum;
    };


    proto$0.getMax = function()
    {
        return this.maximum;
    };


    proto$0.setKFactor = function( kFactor )
    {
        this.kFactor = kFactor || DEFAULT_KFACTOR;

        return this;
    };


    proto$0.setMin = function( minimum )
    {
        this.minimum = minimum;

        return this;
    };


    proto$0.setMax = function( maximum )
    {
        this.maximum = maximum;

        return this;
    };


    proto$0.expectedScore = function( rating, opponentRating )
    {
        var difference = opponentRating - rating;

        return 1 / ( 1 + Math.pow( 10, difference / PERF ) );
    };


    proto$0.bothExpectedScores = function( ratingOne, ratingTwo )
    {
        return [
            this.expectedScore( ratingOne, ratingTwo ),
            this.expectedScore( ratingTwo, ratingOne )
        ];
    };

    /* private-ish, should use functions below */
    proto$0.__processRating = function( expectedScore, actualScore, previousRating )
    {
        var difference  = actualScore - expectedScore;
        var rating      = Math.round( previousRating +
                            this.getKFactor( previousRating ) * difference );

        if ( rating < this.minimum )
        {
            rating = this.minimum;
        }
        else if ( rating > this.maximum )
        {
            rating = this.maximum;
        }

        return rating;
    };


    proto$0.ifWins = function( rating, opponentRating )
    {
        var expectedScore = this.expectedScore( rating, opponentRating );

        return this.__processRating( expectedScore, OUTCOMES.won, rating );
    };


    proto$0.ifLoses = function( rating, opponentRating )
    {
        var expectedScore = this.expectedScore( rating, opponentRating );

        return this.__processRating( expectedScore, OUTCOMES.lost, rating );
    };


    proto$0.ifTies = function( rating, opponentRating )
    {
        var expectedScore = this.expectedScore( rating, opponentRating );

        return this.__processRating( expectedScore, OUTCOMES.tied, rating );
    };
MIXIN$0(Elo.prototype,proto$0);proto$0=void 0;return Elo;})();

return Elo;
} ) );
