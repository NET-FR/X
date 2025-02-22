(async () => {
    var authorization = "Bearer Your User ID"; // replace by authorization value
    var ua = navigator.userAgentData 
    ? navigator.userAgentData.brands.map(brand => `"${brand.brand}";v="${brand.version}"`).join(', ') 
    : navigator.userAgent;
    var client_tid = "Your client ID"; // replace by X-Client-Transaction-Id value
    var client_uuid = "Your client UUID"; // replace by X-Client-Uuid value
    var csrf_token = getCookie("ct0");
    var random_resource = "uYU5M2i12UhDvDTzN6hZPg";
    var random_resource_old_tweets = "H8OOoI-5ZE4NxgRr8lfyWg"
    var language_code = navigator.language.split("-")[0]
    var tweets_to_delete = []
    var user_id = getCookie("twid").substring(4);
    var username = "m_ceb" // replace with your username
    var stop_signal = undefined
    var twitter_archive_content = undefined
    var twitter_archive_loading_confirmed = false

    var delete_options = {
        /* Configuration des options de suppression */
        "from_archive": false,
        "unretweet": false,
        "do_not_remove_pinned_tweet": true,
        "delete_message_with_url_only": false,
        "delete_specific_ids_only": [""],
        "match_any_keywords": [""],
        "tweets_to_ignore": [
            "00000000000000", // exemples d'IDs à ignorer
            "111111111111111",
            "222222222222"
        ],
        "old_tweets": false,
        "after_date": new Date('1900-01-01'), // année-mois-jour
        "before_date": new Date('2100-01-01') // année-mois-jour
    }

    function buildAcceptLanguageString() {
        const languages = navigator.languages;

        if (!languages || languages.length === 0) {
            return "en-US,en;q=0.9"; // Valeur par défaut
        }

        let q = 1;
        const decrement = 0.1;

        return languages.map(lang => {
            if (q < 1) {
                const result = `${lang};q=${q.toFixed(1)}`;
                q -= decrement;
                return result;
            }
            q -= decrement;
            return lang;
        }).join(',');
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fetch_tweets(cursor, retry = 0) {
        let count = "20";
        let final_cursor = cursor ? `%22cursor%22%3A%22${cursor}%22%2C` : "";
        let resource = delete_options["old_tweets"] ? random_resource_old_tweets : random_resource
        let endpoint = delete_options["old_tweets"] ? "UserTweets" : "UserTweetsAndReplies"
        var base_url = `https://x.com/i/api/graphql/${resource}/${endpoint}`;

        var variable = ""
        var feature = ""
        if (delete_options["old_tweets"] == false) {
            variable = `?variables=%7B%22userId%22%3A%22${user_id}%22%2C%22count%22%3A${count}%2C${final_cursor}%22includePromotedContent%22%3Atrue%2C%22withCommunity%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D`;
            feature = `&features=%7B%22rweb_lists_timeline_redesign_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`;
        }
        else {
            variable = `?variables=%7B%22userId%22%3A%22${user_id}%22%2C%22count%22%3A${count}%2C${final_cursor}%22includePromotedContent%22%3Atrue%2C%22withQuickPromoteEligibilityTweetFields%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D`
            feature = `&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`
        }

        var final_url = `${base_url}${variable}${feature}`;

        const response = await fetch(final_url, {
            "headers": {
                "accept": "*/*",
                "accept-language": buildAcceptLanguageString(),
                "authorization": authorization,
                "content-type": "application/json",
                "sec-ch-ua": ua,
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-client-transaction-id": client_tid,
                "x-client-uuid": client_uuid,
                "x-csrf-token": csrf_token,
                "x-twitter-active-user": "yes",
                "x-twitter-auth-type": "OAuth2Session",
                "x-twitter-client-language": language_code
            },
            "referrer": `https://x.com/${username}/with_replies`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });

        if (!response.ok) {
            if (response.status === 429) {
                console.log("Limite de taux atteinte. Attente de 1 minute");
                await sleep(1000 * 60);
                return fetch_tweets(cursor, retry + 1)
            }
            if (retry == 5) {
                throw new Error("Nombre maximal de tentatives atteint");
            }
            console.log(`(fetch_tweets) La réponse réseau n'est pas correcte, nouvelle tentative dans ${10 * (1 + retry)} secondes`);
            console.log(await response.text())
            await sleep(10000 * (1 + retry));
            return fetch_tweets(cursor, retry + 1)
        }
        const data = await response.json();
        var entries = data["data"]["user"]["result"]["timeline_v2"]["timeline"]["instructions"]
        for (item of entries) {
            if (item["type"] == "TimelineAddEntries") {
                entries = item["entries"]
            }
        }
        console.log(entries);
        return entries;
    }

    async function log_tweets(entries) {
        for (let item of entries) {
            if (item["entryId"].startsWith("profile-conversation") || item["entryId"].startsWith("tweet-")) {
                findTweetIds(item)
            }
            else if (item["entryId"].startsWith("cursor-bottom") && entries.length > 2) {
                let cursor_bottom = item["content"]["value"];

                return cursor_bottom;
            }
        }
        return "finished"
    }

    function check_keywords(text) {
        if (delete_options["match_any_keywords"].length == 0) {
            return true
        }
        for (let word of delete_options["match_any_keywords"]) {
            if (text.includes(word))
                return true
        }
        return false
    }

    function check_date(tweet) {
        if (tweet['legacy'].hasOwnProperty('created_at')) {
            tweet_date = new Date(tweet['legacy']["created_at"])
            tweet_date.setHours(0, 0, 0, 0);
            if (tweet_date > delete_options["after_date"] && tweet_date < delete_options["before_date"]) {
                return true
            }
            else if (tweet_date < delete_options["after_date"]) {
                stop_signal = true
            }
            return false
        }
        return true
    }

    function check_date_archive(created_at) {
        tweet_date = new Date(created_at)
        tweet_date.setHours(0, 0, 0, 0);
        if (tweet_date > delete_options["after_date"] && tweet_date < delete_options["before_date"]) {
            return true
        }
        else if (tweet_date < delete_options["after_date"]) {
            stop_signal = true
        }
        return false
    }

    function check_filter(tweet) {
        if (tweet['legacy'].hasOwnProperty('id_str')
            && (delete_options["tweets_to_ignore"].includes(tweet['legacy']["id_str"]) || delete_options["tweets_to_ignore"].includes(parseInt(tweet['legacy']["id_str"])))) {
            return false
        }
        if (delete_options["delete_message_with_url_only"] == true) {
            if (tweet['legacy'].hasOwnProperty('entities') && tweet['legacy']["entities"].hasOwnProperty('urls') && tweet['legacy']["entities"]["urls"].length > 0
                && check_keywords(tweet['legacy']['full_text']) && check_date(tweet)) {
                return true
            }
            return false
        }
        if (check_keywords(tweet['legacy']['full_text']) && check_date(tweet))
            return true
        return false
    }

    function check_filter_archive(tweet_obj) {
        let tweet_id = tweet_obj["id"]
        let tweet_str = tweet_obj["text"]
        let tweet_date = tweet_obj["date"]
        if ((delete_options["tweets_to_ignore"].includes(tweet_id) || delete_options["tweets_to_ignore"].includes(parseInt(tweet_id)))) {
            return false
        }
        if (check_keywords(tweet_str) && check_date_archive(tweet_date))
            return true
        return false
    }

    function check_tweet_owner(obj, uid) {
        if (obj.hasOwnProperty('legacy') && obj['legacy'].hasOwnProperty('retweeted') && obj['legacy']['retweeted'] === true && delete_options["unretweet"] == false)
            return false
        if (obj.hasOwnProperty('user_id_str') && obj['user_id_str'] === uid)
            return true;
        else if (obj.hasOwnProperty('legacy') && obj['legacy'].hasOwnProperty('user_id_str') && obj['legacy']['user_id_str'] === uid)
            return true;
        return false
    }

    function tweetFound(obj) {
        console.log(`Trouvez : ${obj['legacy']['full_text']}`)
    }

    function parseTweetsFromArchive(data) {
        try {
            const filteredIds = [];

            data.forEach(item => {
                if (item.tweet && item.tweet.id_str) {
                    const isInReplyToExcludedUser = item.tweet.in_reply_to_user_id_str === user_id;
                    const startsWithRT = item.tweet.full_text.startsWith('RT ');

                    let tweet_obj = {}
                    tweet_obj["id"] = item.tweet.id_str
                    tweet_obj["text"] = item.tweet.full_text
                    tweet_obj["date"] = item.tweet.created_at
                    if (!isInReplyToExcludedUser
                        && ((delete_options["unretweet"] == true && startsWithRT == true) || (delete_options["unretweet"] == false && startsWithRT == false))
                        && check_filter_archive(tweet_obj)) {
                        ;
                    }
                    else {
                        return;
                    }
                    console.log("SUPPRESSION :", item.tweet.full_text)
                    filteredIds.push(item.tweet.id_str);
                }
            });

            return filteredIds;
        } catch (error) {
            console.error("Erreur lors de l'analyse du JSON :", error);
            return [];
        }
    }

    function findTweetIds(obj) {
        function recurse(currentObj) {
            if (typeof currentObj !== 'object' || currentObj === null
                || (delete_options["do_not_remove_pinned_tweet"] == true && currentObj['__type'] == "TimelinePinEntry")) {
                return;
            }

            if (currentObj['__typename'] === 'TweetWithVisibilityResults' && currentObj.hasOwnProperty('tweet')
                && check_tweet_owner(currentObj['tweet'], user_id) && check_filter(currentObj['tweet'])) {
                tweets_to_delete.push(currentObj['tweet']['id_str'] || currentObj['tweet']['legacy']['id_str']);
                tweetFound(currentObj['tweet'])
            }

            else if (currentObj.hasOwnProperty('__typename') && currentObj['__typename'] === 'Tweet'
                && check_tweet_owner(currentObj, user_id) && check_filter(currentObj)) {
                tweets_to_delete.push(currentObj['id_str'] || currentObj['legacy']['id_str']);
                tweetFound(currentObj)
            }

            for (let key in currentObj) {
                if (currentObj.hasOwnProperty(key)) {
                    recurse(currentObj[key]);
                }
            }
        }

        recurse(obj);
    }

    async function delete_tweets(id_list) {
        var delete_tid = "LuSa1GYxAMxWEugf+FtQ/wjCAUkipMAU3jpjkil3ujj7oq6munDCtNaMaFmZ8bcm7CaNvi4GIXj32jp7q32nZU8zc5CyLw"
        var id_list_size = id_list.length
        var retry = 0

        for (let i = 0; i < id_list_size; ++i) {
            const response = await fetch("https://x.com/i/api/graphql/VaenaVgh5q5ih7kvyVjgtg/DeleteTweet", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": buildAcceptLanguageString(),
                    "authorization": authorization,
                    "content-type": "application/json",
                    "sec-ch-ua": ua,
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-client-transaction-id": delete_tid,
                    "x-client-uuid": client_uuid,
                    "x-csrf-token": csrf_token,
                    "x-twitter-active-user": "yes",
                    "x-twitter-auth-type": "OAuth2Session",
                    "x-twitter-client-language": language_code
                },
                "referrer": `https://x.com/${username}/with_replies`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": `{\"variables\":{\"tweet_id\":\"${id_list[i]}\",\"dark_request\":false},\"queryId\":\"VaenaVgh5q5ih7kvyVjgtg\"}`,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
            if (!response.ok) {
                if (response.status === 429) {
                    console.log("Limite de taux atteinte. Attente de 1 minute");
                    await sleep(1000 * 60);
                    i -= 1;
                    continue
                }
                if (retry == 8) {
                    throw new Error("Nombre maximal de tentatives atteint");
                }
                console.log(await response.text())
                console.log(`(delete_tweets) La réponse réseau n'est pas correcte, nouvelle tentative dans ${10 * (1 + retry)} secondes`);
                i -= 1;
                await sleep(10000 * (1 + retry));
                continue
            }
            retry = 0
            console.log(`${i}/${id_list_size}`)
            await sleep(100);
        }
    }

    var next = null
    var entries = undefined

    if (delete_options["from_archive"] == true) {
        console.log("En attente que l'utilisateur charge son archive Twitter")

        // Création des éléments modaux
        const modal = document.createElement('div');
        modal.id = 'myModal';
        modal.className = 'modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const closeSpan = document.createElement('span');
        closeSpan.className = 'close';
        closeSpan.innerHTML = '&times;';

        const header = document.createElement('h2');
        header.innerText = 'Déposez Votre Fichier Ici';

        const dropArea = document.createElement('div');
        dropArea.id = 'drop-area';
        dropArea.className = 'drop-area';
        dropArea.innerHTML = '<p>Déposez votre tweets.js depuis votre archive Twitter ici</p>';

        // Ajout des éléments
        modalContent.appendChild(closeSpan);
        modalContent.appendChild(header);
        modalContent.appendChild(dropArea);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Ajout des styles CSS
        const styles = `
            .modal {
                display: none;
                position: fixed;
                z-index: 1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-content {
                background-color: #fff;
                margin: auto;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                width: 400px;
                text-align: center;
                position: relative;
            }
            .close {
                color: #aaa;
                position: absolute;
                top: 10px;
                right: 20px;
                font-size: 24px;
                font-weight: bold;
                cursor: pointer;
            }
            .close:hover {
                color: black;
            }
            .drop-area {
                border: 2px dashed #007bff;
                border-radius: 5px;
                padding: 60px;
                cursor: pointer;
                transition: .5s ease-in-out;
            }
            .drop-area:hover {
                border-color: #0056b3;
                background-color: #dff3fb;
                transition: .5s ease-in-out;
            }
            .drop-area.active {
                background-color: #f3f4f6; /* Fond plus clair */
                border-color: #4caf50; /* Bordure verte */
                color: #4caf50; /* Texte vert */
            }
            
            .drop-area.active p {
                font-weight: bold;
                color: #4caf50;
            }
            h2 {
                color: #333;
                margin-bottom: 20px;
            }
            p {
                margin: 0;
                color: #666;
            }
            .confirm-button {
                margin-top: 30px;
                background-color: rgb(0, 116, 212);
                border: 2px solid rgb(0, 116, 212);
                border-radius: 3px;
                color: white;
                padding: 10px 20px;
                cursor: pointer;
            }
            .confirm-button:hover {
                background-color: rgb(0, 95, 180);
                border-color: rgb(0, 95, 180);
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Affichage du modal
        modal.style.display = 'flex';

        // Fermeture du modal au clic
        closeSpan.onclick = function() {
            modal.style.display = 'none';
        };
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
        const confirmButton = document.createElement('button');
        confirmButton.innerText = 'Confirmer';
        confirmButton.className = 'confirm-button';
        confirmButton.style.marginTop = "5px"

        // Ajout du bouton de confirmation au contenu du modal
        modalContent.appendChild(confirmButton);

        // Écouteur d'événement pour le bouton de confirmation
        confirmButton.addEventListener('click', () => {
            if (twitter_archive_content) {
                console.log("Confirmation reçue. Fichier traité.");
                twitter_archive_loading_confirmed = true
                modal.style.display = 'none';
                // Traitement supplémentaire peut être fait ici
            } else {
                console.error("Aucun fichier chargé. Veuillez charger un fichier avant de confirmer.");
            }
        });

        // Fonctionnalité de Drag and Drop
        dropArea.addEventListener('dragover', (event) => {
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            dropArea.classList.add('active'); // Ajout de la classe 'active'
        });

        dropArea.addEventListener('dragleave', (event) => {
            dropArea.classList.remove('active'); // Suppression de la classe 'active'
        });

        dropArea.addEventListener('drop', (event) => {
            event.stopPropagation();
            event.preventDefault();
            dropArea.classList.remove('active'); // Suppression de la classe 'active'
            const file = event.dataTransfer.files[0];
            readFile(file);
        });

        // Fonctionnalité de clic pour télécharger
        dropArea.onclick = function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.onchange = e => {
                const file = e.target.files[0];
                readFile(file);
            };
            fileInput.click();
        };

        function readFile(file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const content = event.target.result;

                // Séparation par '=' et suppression de la première partie
                const parts = content.split('=');
                parts.shift(); // Supprimer le premier élément
                const jsonPart = parts.join('=').trim(); // Réassembler le reste et supprimer les espaces

                try {
                    const data = JSON.parse(jsonPart);
                    twitter_archive_content = data;
                    console.log("Données JSON chargées dans la variable globale.");
                } catch (e) {
                    console.error("Erreur lors de l'analyse du JSON :", e);
                }
            };
            reader.onerror = function(error) {
                console.error("Erreur lors de la lecture du fichier :", error);
            };
            reader.readAsText(file); // Lire le fichier en tant que texte
        }
    }

    if (delete_options["from_archive"] == true) {
        while (twitter_archive_loading_confirmed == false) {
            await sleep(1000)
        }
        tweets_to_delete = parseTweetsFromArchive(twitter_archive_content)
        console.log(tweets_to_delete)
        await delete_tweets(tweets_to_delete)
    }
    else if (delete_options["delete_specific_ids_only"].length == 1 && delete_options["delete_specific_ids_only"][0].length == 0) {
        while (next != "finished" && stop_signal != true) {
            entries = await fetch_tweets(next);
            next = await log_tweets(entries);
            await delete_tweets(tweets_to_delete)
            tweets_to_delete = []
            await sleep(3000);
        }
    }
    else {
        await delete_tweets(delete_options["delete_specific_ids_only"]);
    }

    console.log("SUPPRESSION TERMINÉE (si une erreur s'est produite avant cela, ce message peut ne pas être exact)")
})();
