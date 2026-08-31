/*
 * ============================================================
 * GARDEN BUILDER — ASSET MANIFEST
 * ============================================================
 *
 * The actual garden artwork lives in:
 *
 * CloverTerrace/weather
 * /assets/garden/
 *
 * This manifest tells the builder where those assets live.
 *
 * Later we can automate generation of this file so newly added
 * sprites appear in the builder automatically.
 * ============================================================
 */

const GARDEN_ASSET_BASE =
    "https://cloverterrace.github.io/weather/assets/garden";


/*
 * ============================================================
 * SEASON CONFIGURATION
 * ============================================================
 */

const GARDEN_CATEGORIES = {

    spring: [
        "borders",
        "creatures",
        "crops",
        "decorations",
        "flowers",
        "plants",
        "terrain",
        "tree"
    ],

    summer: [
        "borders",
        "creatures",
        "crops",
        "decorations",
        "flowers",
        "plants",
        "terrain",
        "tree"
    ],

    autumn: [
        "borders",
        "creatures",
        "crops",
        "decorations",
        "flowers",
        "plants",
        "terrain",
        "tree"
    ],

    winter: [
        "borders",
        "creatures",
        "crops",
        "decorations",
        "flowers",
        "plants",
        "terrain",
        "tree"
    ]

};


/*
 * ============================================================
 * ASSET LIST
 * ============================================================
 *
 * For now we're going to start with the Summer artwork that
 * we know exists.
 *
 * More files will be added automatically in the next manifest
 * generation pass.
 * ============================================================
 */

const GARDEN_ASSETS = {

    summer: {

        flowers: [

            "bed-allium.png",
            "bed-blue1.png",
            "bed-daisy.png",
            "bed-hyacinth.png",
            "bed-lily.png",
            "bed-peony.png",
            "bed-rose.png",
            "bed-sunflower.png",
            "bed-tulip.png",

            "flower-blue-cluster.png",
            "flower-blue.png",
            "flower-cluster-colorful.png",
            "flower-cluster-orange.png",
            "flower-cluster-pink.png",
            "flower-colorful.png",
            "flower-daisy-pink.png",
            "flower-orange.png",
            "flower-poppy.png",
            "flower-purple.png",
            "flower-red.png",
            "flower-tall-mixed.png",
            "flower-tall-pink.png",
            "flower-white.png",
            "flower-yellow-marigold.png",
            "flower-yellow.png",

            "flower3.png",
            "flower_big.png",

            "flowers15.png",
            "flowers2.png",
            "flowers25.png",
            "flowers26.png",
            "flowers27.png",
            "flowers28.png",
            "flowers29.png",
            "flowers30.png",
            "flowers31.png",
            "flowers33.png",
            "flowers34.png",
            "flowers35.png",
            "flowers36.png",
            "flowers37.png",
            "flowers38.png",
            "flowers39.png",
            "flowers41.png",
            "flowers42.png",
            "flowers43.png",
            "flowers44.png",
            "flowers45.png",
            "flowers46.png",
            "flowers47.png",
            "flowers48.png",
            "flowers49.png",
            "flowers50.png",
            "flowers51.png",
            "flowers52.png",
            "flowers53.png",
            "flowers54.png",
            "flowers55.png",
            "flowers56.png",
            "flowers57.png",
            "flowers58.png",
            "flowers59.png",
            "flowers60.png",
            "flowers61.png",
            "flowers62.png",
            "flowers63.png",
            "flowers64.png",
            "flowers65.png",

            "flowers7.png",
            "flowers8.png",

            "flytrap.png",
            "forgetmenot.png",
            "gerbdaisy.png",

            "groundcover-pink.png",
            "groundcover-purple.png",
            "groundcover-teal.png",

            "icon-allium.png",
            "icon-blue1.png",
            "icon-daisy.png",
            "icon-hyacinth.png",
            "icon-lily.png",
            "icon-peony.png",
            "icon-rose.png",
            "icon-sunflower.png",
            "icon-tulip.png",

            "lavender.png",
            "lily.png",
            "pansy.png",
            "peony.png",
            "pitcherplant.png",
            "poppy.png",

            "pot-purple.png",
            "pot-red.png",
            "pot-tulip.png",

            "rose.png",
            "sunflower.png",
            "tulip.png",
            "wildpansy.png"

        ]

    }

};


/*
 * ============================================================
 * HELPER FUNCTIONS
 * ============================================================
 */


/**
 * Convert a season/category/file combination into the
 * complete public URL of the image.
 */
function gardenAssetURL(
    season,
    category,
    filename
) {

    return [
        GARDEN_ASSET_BASE,
        season,
        category,
        encodeURIComponent(filename)
    ].join("/");

}


/**
 * Convert filenames into nicer display names.
 *
 * Example:
 *
 * "flower-yellow-marigold.png"
 *
 * becomes:
 *
 * "Flower Yellow Marigold"
 */
function gardenAssetDisplayName(filename) {

    return filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );

}


/**
 * Return every asset belonging to a season.
 */
function getGardenAssets(season) {

    const seasonAssets =
        GARDEN_ASSETS[season] || {};

    const result = [];

    Object.entries(seasonAssets)
        .forEach(([category, files]) => {

            files.forEach(filename => {

                result.push({

                    season,

                    category,

                    filename,

                    name:
                        gardenAssetDisplayName(filename),

                    url:
                        gardenAssetURL(
                            season,
                            category,
                            filename
                        )

                });

            });

        });

    return result;

}
