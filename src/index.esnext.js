/* esnext true */
/* exported Elo */

const CHANCES =
{
    lost    : 0,
    tied    : 0.5,
    won     : 1
};

// lol magic http://en.wikipedia.org/wiki/Elo_rating_system#Mathematical_details
const MAGIC = 400;

// http://en.wikipedia.org/wiki/Elo_rating_system#Most_accurate_K-factor
// USCF k-factors
const DEFAULT_KFACTOR = 32;

const DEFAULT_KFACTORS = function( rating )
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


class Elo
{
    constructor( kFactor, min, max )
    {
        this.setKFactor( kFactor );
        this.minimum = typeof min !== 'undefined' ? min : -Infinity;
        this.maximum = typeof max !== 'undefined' ? max : Infinity;
    }


    getMin()
    {
        return this.minimum;
    }


    setMin( minimum )
    {
        this.minimum = minimum;

        return this;
    }


    getMax()
    {
        return this.maximum;
    }


    setMax( maximum )
    {
        this.maximum = maximum;

        return this;
    }


    getKFactor( rating )
    {
        if ( !isNaN( this.kFactor ) )
        {
            return this.kFactor;
        }

        return DEFAULT_KFACTORS( rating || 0 );
    }

    setKFactor( kFactor )
    {
        this.kFactor = kFactor || DEFAULT_KFACTOR;

        return this;
    }


    odds( rating, opponentRating )
    {
        var difference = opponentRating - rating;

        return 1 / ( 1 + Math.pow( 10, difference / MAGIC ) );
    }


    /* private-ish, should use functions below */
    __processRating( odds, actualScore, previousRating )
    {
        var difference  = actualScore - odds;
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
    }


    ifWins( rating, opponentRating )
    {
        var odds = this.odds( rating, opponentRating );

        return this.__processRating( odds, CHANCES.won, rating );
    }


    ifLoses( rating, opponentRating )
    {
        var odds = this.odds( rating, opponentRating );

        return this.__processRating( odds, CHANCES.lost, rating );
    }


    ifTies( rating, opponentRating )
    {
        var odds = this.odds( rating, opponentRating );

        return this.__processRating( odds, CHANCES.tied, rating );
    }
}
