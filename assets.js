/*
 * ============================================================
 * GARDEN BUILDER — LIVE ASSET LOADER
 * ============================================================
 *
 * The builder lives in:
 *
 *   CloverTerrace/garden-builder
 *
 * The artwork lives in:
 *
 *   CloverTerrace/weather
 *   /assets/garden/
 *
 * This file asks GitHub for the actual repository tree and
 * discovers the garden artwork automatically.
 *
 * Nothing is hardcoded beyond the repository location.
 * ============================================================
 */


/* ============================================================
   REPOSITORY CONFIGURATION
   ============================================================ */

const GARDEN_REPOSITORY = {
    owner: "CloverTerrace",
    repo: "weather",
    branch: "main",
    root: "assets/garden"
};


/*
 * Raw GitHub URL used for the actual image files.
 */
const GARDEN_ASSET_BASE =
    "https://raw.githubusercontent.com/CloverTerrace/weather/main/assets/garden";


/*
 * GitHub API endpoint used to discover files.
 */
const GARDEN_TREE_API =
    "https://api.github.com/repos/" +
    GARDEN_REPOSITORY.owner +
    "/" +
    GARDEN_REPOSITORY.repo +
    "/git/trees/" +
    GARDEN_REPOSITORY.branch +
    "?recursive=1";


/* ============================================================
   SUPPORTED SEASONS
   ============================================================ */

const GARDEN_SEASONS = [
    "spring",
    "summer",
    "autumn",
    "winter"
];


/* ============================================================
   ASSET STORAGE
   ============================================================ */

let GARDEN_ASSET_CACHE = {

    spring: [],
    summer: [],
    autumn: [],
    winter: []

};


/*
 * This lets the builder know whether the repository has
 * finished loading.
 */
let GARDEN_ASSETS_READY = false;


/* ============================================================
   CATEGORY DISPLAY ORDER
   ============================================================ */

const GARDEN_CATEGORY_ORDER = [

    "background",
    "terrain",
    "tree",
    "plants",
    "flowers",
    "crops",
    "decorations",
    "borders",
    "creatures"

];


/* ============================================================
   IMAGE EXTENSIONS
   ============================================================ */

const GARDEN_IMAGE_EXTENSIONS = [

    ".png",
    ".webp",
    ".jpg",
    ".jpeg",
    ".gif"

];


/* ============================================================
   CATEGORY NAME CLEANUP
   ============================================================ */

function gardenCategoryDisplayName(category) {

    return category

        .replace(/[-_]+/g, " ")

        .replace(/\b\w/g, character =>
            character.toUpperCase()
        );

}


/* ============================================================
   ASSET NAME CLEANUP
   ============================================================ */

function gardenAssetDisplayName(filename) {

    return filename

        .replace(/\.[^/.]+$/, "")

        .replace(/[-_]+/g, " ")

        .replace(/\b\w/g, character =>
            character.toUpperCase()
        );

}


/* ============================================================
   CHECK WHETHER FILE IS AN IMAGE
   ============================================================ */

function isGardenImage(path) {

    const lower =
        path.toLowerCase();

    return GARDEN_IMAGE_EXTENSIONS
        .some(extension =>
            lower.endsWith(extension)
        );

}


/* ============================================================
   BUILD PUBLIC IMAGE URL
   ============================================================ */

function gardenAssetURL(path) {

    /*
     * path looks like:
     *
     * assets/garden/summer/flowers/rose.png
     *
     * We remove the "assets/garden/" portion because our
     * raw base already points there.
     */

    const relativePath =
        path.substring(
            GARDEN_REPOSITORY.root.length + 1
        );


    /*
     * Encode each path component individually so spaces and
     * special characters work without encoding the slashes.
     */

    const encodedPath =
        relativePath
            .split("/")
            .map(part =>
                encodeURIComponent(part)
            )
            .join("/");


    return (
        GARDEN_ASSET_BASE +
        "/" +
        encodedPath
    );

}


/* ============================================================
   DISCOVER ALL GARDEN ASSETS
   ============================================================ */

async function discoverGardenAssets() {

    console.log(
        "[Garden Builder] Discovering garden assets..."
    );


    try {

        const response =
            await fetch(
                GARDEN_TREE_API,
                {
                    headers: {
                        "Accept":
                            "application/vnd.github+json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "GitHub API returned " +
                response.status
            );

        }


        const tree =
            await response.json();


        if (!tree.tree) {

            throw new Error(
                "GitHub returned no repository tree."
            );

        }


        /*
         * Reset the cache.
         */

        GARDEN_ASSET_CACHE = {

            spring: [],
            summer: [],
            autumn: [],
            winter: []

        };


        /*
         * Walk every file in the repository tree.
         */

        tree.tree.forEach(entry => {

            if (entry.type !== "blob") {
                return;
            }


            if (
                !entry.path.startsWith(
                    GARDEN_REPOSITORY.root + "/"
                )
            ) {
                return;
            }


            if (!isGardenImage(entry.path)) {
                return;
            }


            /*
             * Remove:
             *
             * assets/garden/
             *
             */

            const relative =
                entry.path.substring(
                    GARDEN_REPOSITORY.root.length + 1
                );


            const parts =
                relative.split("/");


            /*
             * We need at least:
             *
             * season/category/file
             */

            if (parts.length < 3) {
                return;
            }


            const season =
                parts[0].toLowerCase();


            const category =
                parts[1].toLowerCase();


            const filename =
                parts[parts.length - 1];


            /*
             * Ignore anything outside our four seasons.
             */

            if (
                !GARDEN_SEASONS.includes(
                    season
                )
            ) {
                return;
            }


            /*
             * Create our normalized asset record.
             */

            GARDEN_ASSET_CACHE[season].push({

                season,

                category,

                filename,

                path: entry.path,

                name:
                    gardenAssetDisplayName(
                        filename
                    ),

                categoryName:
                    gardenCategoryDisplayName(
                        category
                    ),

                url:
                    gardenAssetURL(
                        entry.path
                    )

            });

        });


        /*
         * Sort everything alphabetically.
         */

        GARDEN_SEASONS.forEach(season => {

            GARDEN_ASSET_CACHE[season]
                .sort((a, b) => {

                    const categoryCompare =
                        a.category.localeCompare(
                            b.category
                        );


                    if (
                        categoryCompare !== 0
                    ) {

                        return categoryCompare;

                    }


                    return a.name.localeCompare(
                        b.name
                    );

                });

        });


        GARDEN_ASSETS_READY = true;


        /*
         * Report what we found.
         */

        console.log(
            "[Garden Builder] Asset discovery complete."
        );


        GARDEN_SEASONS.forEach(season => {

            console.log(
                "  " +
                season +
                ": " +
                GARDEN_ASSET_CACHE[season].length +
                " assets"
            );

        });


        return GARDEN_ASSET_CACHE;


    } catch (error) {

        console.error(
            "[Garden Builder] Asset discovery failed:",
            error
        );


        GARDEN_ASSETS_READY = false;


        throw error;

    }

}


/* ============================================================
   GET ASSETS FOR CURRENT SEASON
   ============================================================ */

function getGardenAssets(season) {

    return (
        GARDEN_ASSET_CACHE[season] || []
    );

}


/* ============================================================
   INITIALIZE ASSET SYSTEM
   ============================================================ */

async function initializeGardenAssets() {

    await discoverGardenAssets();

    /*
     * If the builder's render function already exists,
     * refresh the library immediately after discovery.
     */

    if (
        typeof renderAssetLibrary ===
        "function"
    ) {

        renderAssetLibrary();

    }

}


/* ============================================================
   START DISCOVERY
   ============================================================ */

initializeGardenAssets();
