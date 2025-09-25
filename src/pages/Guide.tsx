// src/pages/Guide.tsx
import React from "react";
import excelExample from "../assets/img_exel.png";
import gen1 from "../assets/img_gen1.png";
import gen2 from "../assets/img_gen2.png";

const Guide: React.FC = () => {
    return (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Guide d’utilisation</h1>
            <p className="text-gray-600">
                Ce guide explique comment utiliser l’application de gestion des convocations étape par étape :
            </p>

            {/* Section Import des candidats */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-blue-700">1. Importer des candidats</h2>
                <p>
                    Le fichier doit être un <strong>Excel</strong> au format <code>.xlsx</code> ou <code>.xls</code>.
                    La première ligne doit contenir les en-têtes obligatoires :
                </p>
                <ul className="list-disc list-inside ml-4 text-gray-700">
                    <li><code>groupe</code></li>
                    <li><code>civilité</code></li>
                    <li><code>nom</code></li>
                    <li><code>prénom</code></li>
                    <li><code>email</code></li>
                    <li><code>date</code> (JJ/MM/AAAA)</li>
                    <li><code>heure</code> (HH:mm)</li>
                    <li><code>salle</code></li>
                    <li><code>numéro jury</code></li>
                </ul>

                <p className="text-gray-600">
                    Exemple correct de fichier Excel :
                </p>
                <img
                    src={excelExample}
                    alt="Exemple de fichier Excel pour import des candidats"
                    className="rounded-lg border border-gray-300 shadow-sm max-w-full"
                />

                <p className="text-gray-600">
                    ⚠️ <strong>Règles à respecter :</strong>
                </p>
                <ul className="list-disc list-inside ml-4 text-gray-700">
                    <li>Chaque colonne obligatoire doit être remplie.</li>
                    <li>Les emails doivent être valides.</li>
                    <li>Les dates et heures doivent être au bon format.</li>
                    <li>Pas de doublons de candidats.</li>
                </ul>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-yellow-800 font-semibold">⚠️ Très important :</p>
                    <p className="text-yellow-700 text-sm mt-1">
                        Lors de l’import, l’application génère un <strong>Session ID</strong>.
                        Ce Session ID est unique et correspond à votre import.
                        <br/>
                        👉 Vous devez <strong>le copier et le conserver</strong>, car il sera requis pour les
                        étapes suivantes : <strong>Génération des convocations</strong> et <strong>Envoi par
                        email</strong>.
                        <br/>
                        Chaque import crée un nouveau Session ID, et toutes les actions (génération, envoi)
                        sont toujours liées à cet identifiant.
                    </p>
                </div>

                <p className="text-gray-600 mt-4">
                    ✅ Pour importer : <br/>
                    1. Cliquez sur <strong>Importer des candidats</strong> dans le Dashboard. <br/>
                    2. Sélectionnez votre fichier Excel. <br/>
                    3. Validez → l’application affiche le nombre de candidats importés et le{" "}
                    <strong>Session ID</strong> associé.
                </p>
            </section>
            <br/>
            <br/>

            {/* Placeholder pour les prochaines étapes */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-green-700">2. Générer les convocations</h2>
                <p>
                    Une fois les candidats importés, vous devez générer leurs convocations.
                    Cette étape est <span className="font-semibold text-red-600">indissociable du Session ID </span>
                    fourni lors de l’import (⚠️ conservez-le bien, il n’est fourni qu’une seule fois).
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        Collez le <strong>Session ID</strong> dans le formulaire de génération.
                    </li>
                    <li>
                        Remplissez tous les champs marqués d’un <span className="text-red-600">*</span> (obligatoires).
                    </li>
                    <li>
                        Téléversez le modèle Word de génération.
                        <span className="text-sm text-gray-500 block">
                         Les variables à remplacer doivent être entourées de <code>{`{{ }}`}</code>,
                         par exemple <code>{`{{NOM}}`}</code>, <code>{`{{PRENOM}}`}</code>, <code>{`{{DATE}}`}</code>.
                        </span>
                    </li>
                    <br/>
                    <div className="mt-4 space-y-4">
                        <img src={gen1} alt="Exemple modèle Word avec variables" className="rounded border" />
                    </div>
                    <br/>

                    <li>
                        Vous pouvez modifier le modèle avant l’upload (ajouter ou retirer certaines variables comme{" "}
                        <code>{`{{DATE_RENDU}}`}</code>, <code>{`{{HEURE_RENDU}}`}</code>, ou{" "}
                        <code>{`{{LIEN_DRIVE}}`}</code> si elles ne sont pas nécessaires).
                    </li>
                    <li>
                        La signature est optionnelle : vous pouvez soit l’ajouter via le champ d’upload d’image,
                        soit insérer directement l’image dans le modèle Word à la place de <code>{`{{SIGN}}`}</code>.
                    </li>
                </ul>

                <div className="bg-gray-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="text-sm text-gray-700">
                        Après la génération, un bouton <strong>Télécharger le ZIP</strong> apparaîtra.
                        Téléchargez toujours le fichier, puis vérifiez que :
                    </p>
                    <ul className="list-disc list-inside ml-4 text-sm text-gray-700">
                        <li>Le nombre de convocations correspond au nombre de candidats importés.</li>
                        <li>Les fichiers générés portent les bons noms.</li>
                        <li>Le contenu des convocations est correct et conforme à vos attentes.</li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-500">
                        ⚠️ Si la convocation génère deux pages au lieu d’une à cause de la signature,
                        insérez-la vous-même dans le modèle Word puis rechargez-le sans utiliser l’upload d’image. (Voir image)
                    </p>
                    <br/>
                    <img src={gen2} alt="Exemple convocation générée" className="rounded border" />
                </div>
            </section>

            <br/>
            <br/>
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-purple-700">3. Envoi par email</h2>
                <p>
                    Après avoir généré vos convocations, vous pouvez les envoyer directement aux candidats par email.
                    Cette étape nécessite toujours le <strong>Session ID</strong> obtenu lors de la génération des convocations.
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        <strong>Session ID *</strong> : collez l'ID de session obtenu lors de la génération des convocations.
                    </li>
                    <li>
                        <strong>Libellé de l'examen *</strong> : par exemple <em>Examen final - Développement Web</em>.
                    </li>
                    <li>
                        <strong>Adresses en copie (CC)</strong> : ajoutez au moins une adresse email pour conserver une preuve d’envoi.
                        Les emails seront toujours envoyés depuis <strong>pedagonantes@gmail.com</strong>.
                    </li>
                </ul>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-yellow-800 font-semibold">⚠️ Important :</p>
                    <p className="text-yellow-700 text-sm mt-1">
                        - Assurez-vous que le <strong>Session ID</strong> correspond bien à la génération des convocations.<br/>
                        - Ajoutez au moins une adresse en copie (CC) pour garder une trace de tous les emails envoyés.<br/>
                        - Les convocations sont envoyées individuellement à chaque candidat pour préserver la confidentialité via les adresses mails fournit dans le fichier excel.
                        - Les convocations sont envoyées automatiquement depuis <strong>pedagonantes@gmail.com</strong>.
                    </p>
                </div>

            </section>
            <br/>
            <br/>

            {/* Section Administration */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-indigo-700">4. Administration</h2>
                <p>
                    L’espace <strong>Administration</strong> permet de gérer toutes les données de référence nécessaires au bon fonctionnement
                    de l’application. Vous pouvez <strong>ajouter</strong>, <strong>modifier</strong> ou <strong>supprimer</strong> des éléments
                    selon vos besoins.
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        <strong>Villes</strong> : gérez la liste des villes disponibles pour les centres d’examen.
                    </li>
                    <li>
                        <strong>Adresses</strong> : définissez les adresses précises liées aux villes (ex: campus, établissements).
                    </li>
                    <li>
                        <strong>Certifications</strong> : créez et organisez les certifications proposées aux candidats.
                    </li>
                    <li>
                        <strong>Classes</strong> : gérez les classes/groupes de candidats.
                        <span className="block text-sm text-gray-500">
                👉 Chaque classe peut être liée à une ou plusieurs <strong>certification</strong> et ou <strong>type d’examen</strong>.
            </span>
                    </li>
                    <li>
                        <strong>Types d’examen</strong> : définissez les différentes natures d’épreuves.
                    </li>
                    <li>
                        <strong>Durées d’épreuve</strong> : configurez la durée par défaut de chaque type d’épreuve.
                    </li>
                </ul>


            </section>

        </div>
    );
};

export default Guide;
