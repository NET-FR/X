# 🚀 X Scripts by Net.Fr

Welcome to **X Scripts**! 🎉 This repository is an improved and functional version of the [DeleteTweets](https://github.com/Lyfhael/DeleteTweets) repository, designed to enhance your experience on the **X** social network.

## 📄 Tutorials

### 📝 English Tutorial

#### **Text Tutorial**

1. **Navigate to X:**
   - Go to [https://twitter.com/](https://twitter.com/).

2. **Open Developer Tools:**
   - Press `CTRL + SHIFT + I` to open DevTools.

3. **Access the Network Tab:**
   - Click on the **Network** tab in DevTools.
   - If requests are not being recorded, press `CTRL + E` and wait for 5 seconds.

4. **Monitor Requests:**
   - You should now see a list of network requests (e.g., `ULXBFrT`).
  ![Network Tab](https://github.com/NET-FR/X/blob/main/screen1.png)

5. **Filter Requests:**
   - Click on **Fetch/XHR** to filter the requests.
      ![Fetch XHR](https://github.com/NET-FR/X/blob/main/screen2.png)
     

6. **Identify Required Tokens:**
   - Click on any request in the results.
   - Look for the following values in the request headers:
     - `authorization`
     - `X-Client-Transaction-Id`
     - `X-Client-Uuid`
   - Refer to the screenshot all.json:
     ![All.json](https://github.com/NET-FR/X/blob/main/screen3.png)
     ![The IDs](https://github.com/NET-FR/X/blob/main/screen4.png)

7. **Configure the Script:**
   - Open the `XPost-TweetDelete.js` script from this repository.
   - Replace the placeholder values with the tokens you found:
     ```javascript
     var authorization = "Bearer YOUR_BEARER_TOKEN"; // replace with your Bearer token
     var client_tid = "YOUR_CLIENT_TRANSACTION_ID"; // replace with your Client Transaction ID
     var client_uuid = "YOUR_CLIENT_UUID"; // replace with your Client UUID
     var username = "YourUsername"; // replace with your X username
     ```

#### **Filtering / Options**

1. **Delete Tweets Within a Specific Date Range:**
   - Edit the `before_date` and `after_date` in the `delete_options` variable:
     ```javascript
     "after_date": new Date('1900-01-01'), // year-month-day
     "before_date": new Date('2100-01-01') // year-month-day
     ```
   - **Example:** To delete tweets from July 3rd, 2023:
     ```javascript
     "after_date": new Date('2023-07-02'), // year-month-day
     "before_date": new Date('2023-07-04') // year-month-day
     ```

2. **Filter Tweets by Keywords:**
   - To delete tweets containing specific keywords, modify the `match_any_keywords` array:
     ```javascript
     var delete_options = {
         "delete_message_with_url_only": false,
         "match_any_keywords": ["Hi", "Hello"]
     }
     ```

3. **Delete Tweets Containing Links Only:**
   - Set `delete_message_with_url_only` to `true`:
     ```javascript
     "delete_message_with_url_only": true
     ```
   - This can be combined with keyword filtering.

4. **Ignore Specific Tweets:**
   - Add tweet IDs you want to keep in the `tweets_to_ignore` array:
     ```javascript
     "tweets_to_ignore": ["00000000000000", "111111111111111", "222222222222"]
     ```

5. **Unretweet Option:**
   - To also unretweet, set the `unretweet` property:
     ```javascript
     "unretweet": true
     ```

6. **Handling Old Tweets:**
   - If some tweets are not deleted and no errors are thrown, set `old_tweets` to `true` and rerun the script:
     ```javascript
     "old_tweets": true
     ```

7. **Do Not Remove Pinned Tweet:**
   - By default, the script avoids removing your pinned tweet. This is controlled by:
     ```javascript
     "do_not_remove_pinned_tweet": true
     ```

8. **Delete Specific Tweet IDs Only:**
   - To override default search and delete only specific tweets, use:
     ```javascript
     "delete_specific_ids_only": ["tweet_id1", "tweet_id2"]
     ```

9. **From Archive Option:**
   - For faster and more comprehensive deletion without rate limits, enable the archive option:
     ```javascript
     "from_archive": true
     ```
   - Download your archive from X, set this option to `true`, and upload your `tweets.js` file when prompted.

#### **Execution**

- **Run the Script:**
  - Copy and paste the entire `XPost-TweetDelete.js` script into the browser console.
  - Press `Enter` and wait for the deletion to complete.
  - The console will display "DELETION COMPLETE" upon completion.
  - For any remaining tweets, rerun the script.

#### **Support**

- **Issues:** Feel free to open an issue on [GitHub Issues](https://github.com/NET-FR/X/issues).
- **Tickets:** Support tickets are welcomed in English and French 🇫🇷.

#### **FAQ**

- **Do I need to include the Bearer part of the authorization key?**
  - **Yes**

- **I can't find X-Client-Transaction-Id/X-Client-Uuid/authorization:**
  - In the request list, search for requests named `client_event.json`. They are the most frequent and always contain the tokens you need.

- **Uncaught TypeError: entries is not iterable:**
  - If you encounter this error, edit the `random_resource` variable in the script:
    ```javascript
    var random_resource = "Q6aAvPw7azXZbqXzuqTALA";
    ```
  - Then, go to the `fetch_tweets()` function and update the `feature` variable as follows:
    ```javascript
    var feature = `&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D"`;
    ```
  - This should resolve the error. Additionally, ensure you have the latest version of the script updated on 5/09/2023.

---

### 📝 French Tutorial

#### **Tutoriel Textuel**

1. **Accéder à X:**
   - Allez sur [https://twitter.com/](https://twitter.com/).

2. **Ouvrir les Outils de Développement:**
   - Appuyez sur `CTRL + SHIFT + I` pour ouvrir les DevTools.

3. **Accéder à l'Onglet Réseau:**
   - Cliquez sur l'onglet **Network** dans DevTools.
   - Si les requêtes ne sont pas enregistrées, appuyez sur `CTRL + E` et attendez 5 secondes.

4. **Surveiller les Requêtes:**
   - Vous devriez voir une liste de requêtes réseau (par exemple, `ULXBFrT`).
     ![Network Tab](https://github.com/NET-FR/X/blob/main/screen1.png)


5. **Filtrer les Requêtes:**
   - Cliquez sur **Fetch/XHR** pour filtrer les requêtes.
    ![Fetch XHR](https://github.com/NET-FR/X/blob/main/screen2.png)


6. **Identifier les Tokens Requis:**
   - Cliquez sur n'importe quelle requête dans les résultats.
   - Recherchez les valeurs suivantes dans les en-têtes de requête :
     - `authorization`
     - `X-Client-Transaction-Id`
     - `X-Client-Uuid`
     ![All.json](https://github.com/NET-FR/X/blob/main/screen3.png)
     ![The IDs](https://github.com/NET-FR/X/blob/main/screen4.png)

7. **Configurer le Script:**
   - Ouvrez le script `XPost-TweetDelete.js` de ce dépôt.
   - Remplacez les valeurs des variables par les tokens trouvés :
     ```javascript
     var authorization = "Bearer YOUR_BEARER_TOKEN"; // remplacez par votre Bearer token
     var client_tid = "YOUR_CLIENT_TRANSACTION_ID"; // remplacez par votre Client Transaction ID
     var client_uuid = "YOUR_CLIENT_UUID"; // remplacez par votre Client UUID
     var username = "YourUsername"; // remplacez par votre nom d'utilisateur X
     ```

#### **Filtrage / Options**

1. **Supprimer les Tweets dans une Plage de Dates Spécifique:**
   - Éditez `before_date` et `after_date` dans la variable `delete_options` :
     ```javascript
     "after_date": new Date('1900-01-01'), // année-mois-jour
     "before_date": new Date('2100-01-01') // année-mois-jour
     ```
   - **Exemple:** Pour supprimer les tweets du 3 juillet 2023 :
     ```javascript
     "after_date": new Date('2023-07-02'), // année-mois-jour
     "before_date": new Date('2023-07-04') // année-mois-jour
     ```

2. **Filtrer les Tweets par Mots-Clés:**
   - Pour supprimer les tweets contenant des mots-clés spécifiques, modifiez le tableau `match_any_keywords` :
     ```javascript
     var delete_options = {
         "delete_message_with_url_only": false,
         "match_any_keywords": ["Hi", "Hello"]
     }
     ```

3. **Supprimer les Tweets Contenant des Liens Uniquement:**
   - Mettez `delete_message_with_url_only` à `true` :
     ```javascript
     "delete_message_with_url_only": true
     ```
   - Cela peut être combiné avec le filtrage par mots-clés.

4. **Ignorer des Tweets Spécifiques:**
   - Ajoutez les IDs des tweets que vous souhaitez conserver dans le tableau `tweets_to_ignore` :
     ```javascript
     "tweets_to_ignore": ["00000000000000", "111111111111111", "222222222222"]
     ```

5. **Option Unretweet:**
   - Pour également annuler des retweets, mettez la propriété `unretweet` :
     ```javascript
     "unretweet": true
     ```

6. **Gestion des Anciens Tweets:**
   - Si certains tweets ne sont pas supprimés et qu'aucune erreur n'est levée, mettez `old_tweets` à `true` et relancez le script :
     ```javascript
     "old_tweets": true
     ```

7. **Ne Pas Supprimer le Tweet Épinglé:**
   - Par défaut, le script évite de supprimer votre tweet épinglé. Ceci est contrôlé par :
     ```javascript
     "do_not_remove_pinned_tweet": true
     ```

8. **Supprimer uniquement des IDs de Tweets Spécifiques:**
   - Pour remplacer la recherche par défaut et supprimer uniquement des tweets spécifiques, utilisez :
     ```javascript
     "delete_specific_ids_only": ["tweet_id1", "tweet_id2"]
     ```

9. **Option Archive:**
   - Pour une suppression plus rapide et complète sans limites de taux, activez l'option archive :
     ```javascript
     "from_archive": true
     ```
   - Téléchargez votre archive depuis X, activez cette option en la mettant à `true`, puis téléchargez votre fichier `tweets.js` lorsqu'il est demandé.

#### **Exécution**

- **Exécuter le Script:**
  - Copiez et collez l'intégralité du script `XPost-TweetDelete.js` dans la console du navigateur.
  - Appuyez sur `Entrée` et attendez que la suppression soit terminée.
  - La console affichera "DELETION COMPLETE" une fois terminée.
  - Pour tout tweet restant, relancez le script.

#### **Support**

- **Issues:** N'hésitez pas à ouvrir une issue sur [GitHub Issues](https://github.com/NET-FR/X/issues).
- **Tickets:** Les tickets de support sont acceptés en anglais et en français 🇫🇷.

#### **FAQ**

- **Dois-je inclure la partie Bearer de la clé d'autorisation ?**
  - **Oui**

- **Je ne trouve pas X-Client-Transaction-Id/X-Client-Uuid/authorization :**
  - Dans la liste des requêtes, recherchez les requêtes nommées `client_event.json`. Elles sont les plus fréquentes et contiennent toujours les tokens nécessaires.

- **Uncaught TypeError: entries is not iterable :**
  - Si vous rencontrez cette erreur, éditez la variable `random_resource` dans le script :
    ```javascript
    var random_resource = "Q6aAvPw7azXZbqXzuqTALA";
    ```
  - Ensuite, allez dans la fonction `fetch_tweets()` et mettez à jour la variable `feature` comme suit :
    ```javascript
    var feature = `&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D"`;
    ```
  - Cela devrait résoudre l'erreur. De plus, assurez-vous d'avoir la dernière version du script mise à jour le 30/01/2025.

---

## Who is NET.FR 🚀🧑🏼‍🚀

NER.FR is a french company who offer many services for professionals.

We help to construct a better Web

1. **Be a partner**
   - Go to [https://www.net.fr/devenir-partenaire](https://www.net.fr/devenir-partenaire) to have possibility ressel our sites and domains.

2. **Find Us on X:**
   - Here [https://x.com/netpfr](https://x.com/netpfr)

3. **Find Us on Linkedin:**
   - Here [https://linkedin.com/company/netfr](https://linkedin.com/company/net-fr/)
  
---

## Qui est NET.FR 🚀🧑🏼‍🚀

NER.FR est une entreprise Française qui offre plusieurs services pour les professionnels.

Notre vision est de vous accompagner pour un Web meilleur!

1. **Devenir Partenaire**
   - Rendez vous ici [https://www.net.fr/devenir-partenaire](https://www.net.fr/devenir-partenaire) pour pouvoir revendre nos noms de domaines en marque blanche.

2. **Trouvez nous sur X:**
   - Ici [https://x.com/netpfr](https://x.com/netpfr)

3. **Trouvez nous sur Linkedin:**
   - Ici [https://linkedin.com/company/netfr](https://linkedin.com/company/net-fr/)
  


That's it! Your repository **NET-FR/X** now includes the updated and functional `XPost-TweetDelete.js` script along with comprehensive tutorials in both English and French. Images can be easily uploaded and embedded in your README using the steps above.

If you need further assistance, feel free to ask!

---

Enjoy 💪🏼
