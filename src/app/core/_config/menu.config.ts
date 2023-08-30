export class MenuConfig {
  public defaults: any = {
    header: {
      self: {},
      items: [],
    },
    aside: {
      self: {},
      items: [
        // {
        //   title: 'Dashboard',
        //   root: true,
        //   icon: 'flaticon2-architecture-and-city',
        //   page: '/dashboard',
        //   translate: 'MENU.DASHBOARD',
        //   bullet: 'dot',
        // },
        // {
        //   title: 'Layout Builder',
        //   root: true,
        //   icon: 'flaticon2-expand',
        //   page: '/builder'
        // },
        { section: "MENUS GENERALS" },

        {
          title: "Dashboard",
          bullet: "dot",
          icon: "flaticon-dashboard",
          root: true,
          submenu: [
            {
              title: "Dashboard",
              page: "/dashboard/manager-dashboard",
            },
            {
              title: "Dashboard Commercial",
              page: "/dashboard/commercial-dashboard",
            },
            {
              title: "Dashboard CRM",
              page: "/dashboard/crm-dashboard",
            },
          ],
        },
        
        {
          title: "POS",
          bullet: "dot",
          icon: "flaticon2-shopping-cart",
          root: true,
          submenu: [
            {
              title: "Pos",
              page: "/pos",
            },
            {
              title: "Pos cafette",
              page: "/pos-cafette",
            },
            {
              title: "Weekly inventory",
              page: "/weekly-inventory",
            },
            {
              title: "Transfert des recettes",
              page: "/revenue-transfer",
            },
            {
              title: "Pos call center",
              page: "/pos-visitor",
            },
          ]
        
        },
        {
          title: "Rapports",
          bullet: "dot",
          icon: "flaticon-file-2",
          root: true,
          submenu: [
            {
              title: "Rapport Journalier",
              page: "/sales/dayly-site-trans",
            },
            {
              title: "Consultation des Ventes",
              page: "/sales/list-sales",
            },
            {
              title: "Consultation des Commandes",
              page: "/sales/list-pos",
            },
            {
              title: "Consultation des Caisses",
              page: "/sales/list-caisse",
            },
            {
              title: "Consultation des CA par Boutique",
              page: "/sales/list-site-ca",
            },
            {
              title: "Consultation des Transactions Grp ",
              page: "/inventory-transaction/trans-list-grp",
            },
            {
              title: "Consultation des Inventaires ",
              page: "/inventory-transaction/list-inv",
            },
            {
              title: "Consultation des Récéption ",
              page: "/inventory-transaction/list-rct",
            },
            {
              title: "Rapports detaillé par site ",
              page: "/inventory-transaction/conso-report",
            },
          ],
        },
        // CRM
        {
          title: "CRM",
          bullet: "dot",
          icon: "flaticon-event-calendar-symbol",
          root: true,
          submenu: [
            {
              title: "Agenda",
              page: "/crm/agenda",
            },
            {
              title: "Ajouter un paramètre CRM",
              page: "/crm/param-add",
            },
            {
              title: "Ajouter une population",
              page: "/crm/population-add",
            },
            {
              title: "Ajouter une réclamation",
              page: "/customers/customer-reclamation",
            },
            {
              title: "Ajouter une satisfaction",
              page: "/customers/customer-satisfaction",
            },
          ],
        },

        // PROMO
        {
          title: "Promotion",
          bullet: "dot",
          icon: "flaticon-event-calendar-symbol",
          root: true,
          submenu: [
            {
              title: "Ajouter population article",
              page: "/promo/population-art-add",
            },
            {
              title: "Ajouter population client",
              page: "/crm/population-add",
            }, 
            {
              title: "Ajouter avantage",
              page: "/promo/advantage-add",
            }, 
            {
              title: "Ajouter promotion",
              page: "/promo/promo-add",
            }, 
            
            
          ],
        },
        
        {
          title: "Gestion des Fournisseurs",
          bullet: "dot",
          icon: "flaticon2-group",
          root: true,
          submenu: [
            {
              title: "La liste des achats par Fournisseur",
              page: "/providers/itembyproviderlist",
            },
            {
              title: "Activité Fournisseur",
              page: "/providers/provider-activitylist",
            },
            {
              title: "Chiffre d'affaire par Fournisseur",
              page: "/providers/provider-calist",
            },
            {
              title: "La liste des Fournisseurs",
              page: "/providers/list",
            },
            {
              title: "Ajouter Fournisseurs",
              page: "/providers/add",
            },
            {
              title: "Répertoire Fournisseurs",
              page: "/providers/create-rep",
            },
            {
              title: "Liste Répertoire Fournisseurs",
              page: "/providers/list-rep",
            },
          ],
        },
        {
          title: "Gestion des Clients",
          bullet: "dot",
          icon: "flaticon-customer",
          root: true,
          submenu: [
            {
              title: "La liste des Clients",
              page: "/customers/customer-list",
            },
            {
              title: "Ajouter Clients",
              page: "/customers/customer-create",
            },
            {
              title: "Répertoire Clients",
              page: "/customers/create-rep",
            },
            {
              title: "Liste Répertoire Fournisseurs",
              page: "/customers/list-rep",
            },
            {
              title: "La liste des ventes par clients",
              page: "/customers/caby-itemlist",
            },
            {
              title: "Activité clients",
              page: "/customers/Customer-activitylist",
            },
            {
              title: "Soldes clients",
              page: "/customers/Customer-soldelist",
            },
            {
              title: "Chiffre d'affaires par clients",
              page: "/customers/Customer-calist",
            },
          ],
        },
        {
          title: "Gestion des clients mobile",
          bullet: "dot",
          icon: "flaticon2-avatar",
          root: true,
          submenu: [
            {
              title: "La liste des Clients",
              page: "/customers-mobile/list-customer-mobile",
            },
            {
              title: "Ajouter Clients",
              page: "/customers-mobile/create-customer-mobile",
            },
            {
              title: "Ajouter Cluster",
              page: "/customers-mobile/cluster-create",
            },
            {
              title: "Ajouter Category",
              page: "/customers-mobile/category-create",
            },
            {
              title: "Ajouter Sub Cluster",
              page: "/customers-mobile/cluster-sub-create",
            },
            {
              title: "Ajouter Category Type",
              page: "/customers-mobile/category-type-create",
            },
            {
              title: "Ajouter canaux de vente",
              page: "/customers-mobile/sales-channels-create",
            },
          ],
        },
        {
          title: "Gestion des articles",
          bullet: "dot",
          icon: "flaticon2-box-1",
          root: true,
          submenu: [
            {
              title: "La liste des articles",
              page: "/articles/list",
            },
            {
              title: "Modification des articles",
              page: "/articles/list-update",
            },
            {
              title: "Génération Article",
              page: "/articles/create-spec",
            },
            {
              title: "Ajouter des Articles",
              page: "/articles/add",
            },
            {
              title: "MAINT Cout Article",
              page: "/articles/edit-cost",
            },
            {
              title: "Créer une page de produits",
              page: "/articles/page",
            },
          ],
        },
        {
          title: "Gestion Stock",
          root: true,
          bullet: "dot",
          icon: "flaticon2-delivery-package",
          submenu: [
            {
              title: "Chargement Des Vans",
              page: "/inventory-management/loading-vans",
            },
            {
              title: "Dechargement Des Vans",
              page: "/inventory-management/unloading-vans",
            },
            {
              title: "Consultation demandes de chargement",
              page: "/inventory-management/load-request-list",
            },
            {
              title: "Réception OA",
              page: "/inventory-transaction/po-receip",
            },
            {
              title: "Réception et Etiquetage",
              page: "/inventory-transaction/po-receip-cab",
            },
            {
              title: "Etiquetage MP",
              page: "/inventory-transaction/label-create",
            },
            {
              title: "Transfert Article",
              page: "/inventory-transaction/transfer",
            },
            {
              title: "Sortie non Planifiée ",
              page: "/inventory-transaction/unplanified-issue",
            },
            {
              title: "Entrée non Planifiée ",
              page: "/inventory-transaction/unplanified-recept",
            },
            {
              title: "Modification Statut Stock ",
              page: "/inventory-transaction/edit-status",
            },

            {
              title: "Consultation Stocks ",
              page: "/inventory-transaction/inventory-list",
            },
            {
              title: "Consultation des Transactions ",
              page: "/inventory-transaction/transaction-list",
            },
            {
              title: "Consultation des Transactions Groupées ",
              page: "/inventory-transaction/trans-list-grp",
            },
            {
              title: "Etat du Stock A date",
              page: "/inventory-management/inventory-of-date",
            },
            {
              title: "Journal des stocks",
              page: "/inventory-management/inventory-activitylist",
            },
            {
              title: "Etat du Stock par Emplacement",
              page: "/inventory-management/inventory-byloclist",
            },
            {
              title: "Etat du Stock par Statut",
              page: "/inventory-management/inventory-bystatuslist",
            },
            {
              title: "Etat du Stock sous sécurité",
              page: "/inventory-management/out-of-stocklist",
            },
            {
              title: "Gestion des inventaires",
              icon: "flaticon2-delivery-package",
              submenu: [
                {
                  title: "Generation liste d’inventaire",
                  page: "/inventory-management/physical-inventory-tag",
                },
                {
                  title: "Menu gel des stocks",
                  page: "/inventory-management/freeze-inventory",
                },
                {
                  title: "Saisie inventaire",
                  page: "/inventory-management/physical-inventory-tag-entry",
                },
                {
                  title: "Analyse des ecarts",
                  page: "/inventory-management/tag-gap-analysis",
                },
                {
                  title: "ReSaisie inventaire",
                  page: "/inventory-management/physical-inventory-tag-reentry",
                },
                {
                  title: "Validation inventaire",
                  page: "/inventory-management/validate-tag",
                },
              ],
            },
          ],
        },

        {
          title: "Gestion des achats",
          root: true,
          bullet: "dot",
          icon: "flaticon2-shopping-cart",
          submenu: [
            {
              title: "Demande d'achats",
              page: "/purchasing/create-req",
            },
            {
              title: "Liste des Demande d'achats",
              page: "/purchasing/req-list",
            },
            {
              title: "Approbation Demande",
              page: "/purchasing/purchase-order-approval",
            },
            {
              title: "Approbation des Demandes d'achats",
              page: "/purchasing/list-approval",
            },
            {
              title: "Offre Fournisseurs",
              page: "/purchasing/create-vendor-proposal",
            },
            {
              title: "Liste des Offre Fournisseurs",
              page: "/purchasing/vp-list",
            },
            {
              title: "Tableau comparatif des offre",
              page: "/purchasing/vendor-propsal-comparaison",
            },
            {
              title: "Bon de commande",
              page: "/purchasing/create-po",
            },
            {
              title: "Simulateur des commandes",
              page: "/purchasing/create-oa",
            },
            {
              title: "Simulateur des commandes Embalage",
              page: "/purchasing/create-oa-em",
            },
            {
              title: "Impression Bon de commande",
              page: "/purchasing/print-po",
            },
            {
              title: "Liste des Bon de commande",
              page: "/purchasing/po-list",
            },
            {
              title: "Edit Status BC",
              page: "/purchasing/edit-status-po",
            },
            {
              title: "Consultations des commandes",
              page: "/purchasing/purchase-list",
            },
            {
              title: "Paiement des Récéption",
              page: "/purchasing/payment-au",
            },
          ],
        },

        {
          title: "Gestion des Ventes",
          root: true,
          bullet: "dot",
          icon: "flaticon2-delivery-package",
          submenu: [
            {
              title: "Offres Commerciales",
              page: "/sales/create-quote",
            },
            {
              title: "Liste des Offres",
              page: "/sales/req-list",
            },
            {
              title: "Confirmation Offre",
              page: "/sales/purchase-order-approval",
            },
            {
              title: "Commande Clients",
              page: "/sales/create-so",
            },
            {
              title: "Modification des Commandes",
              page: "/sales/list-so-edit",
            },
            {
              title: "Débloque commande",
              page: "/sales/unblock-so",
            },
            {
              title: "Confirmation commande",
              page: "/sales/confirm-so",
            },
            {
              title: "Liste des Commandes",
              page: "/sales/so-list",
            },
            {
              title: "Génération des BL",
              page: "/sales/create-psh",
            },
            {
              title: "Paiement des BL",
              page: "/sales/payment-psh",
            },
            {
              title: "Facturation ",
              page: "/sales/create-invoice",
            },
            {
              title: "Facture en Attente ",
              page: "/sales/create-direct-invoice",
            },
            {
              title: "Facture Projet ",
              page: "/sales/create-project-invoice",
            },
            {
              title: "Imputation Facture Projet",
              page: "/sales/imput-project-invoice",
            },
            {
              title: "Impression Facture en Attente ",
              page: "/sales/print-invoice",
            },
            {
              title: "Imputation Facture ",
              page: "/sales/input-invoice",
            },
            {
              title: "Liste des Factures",
              page: "/sales/list-invoices",
            },
            {
              title: "Liste des Factures DD",
              page: "/sales/list-invoice-mob",
            },
            {
              title: "Liste des Paiement DD",
              page: "/sales/list-paiement-mob",
            },
            {
              title: "Liste des Visites",
              page: "/sales/list-visit-mob",
            },
            
          ],
        },
        {
          title: "Gestion des Prévisions",
          root: true,
          bullet: "dot",
          icon: "flaticon2-rocket",
          submenu: [
            {
              title: "Maint Prévision",
              page: "/forcast/create-forcast",
            },

            {
              title: "Liste des Prévisions",
              page: "/forcast/list-forcast",
            },
          ],
        },

        {
          title: "Comptabilité Client",
          root: true,
          bullet: "dot",
          icon: "flaticon2-analytics-1",
          submenu: [
            {
              title: "Maint des Paiement",
              page: "/account-receivable/create-account-receivable",
            },
            {
              title: "Paiement par Projet",
              page: "/project/create-project-payment",
            },
            {
              title: "Liste des Paiement",
              page: "/account-receivable/list-payment",
            },
            {
              title: "Paiement à Rapproché",
              page: "/account-receivable/list-payment-rap",
            },
            {
              title: "Maint des Notes de Débit",
              page: "/account-receivable/create-note",
            },
            {
              title: "Journal Client",
              page: "/account-receivable/edit-journal",
            },
          ],
        },
        {
          title: "Comptabilité Fournisseur",
          root: true,
          bullet: "dot",
          icon: "flaticon2-analytics",
          submenu: [
            {
              title: "Maint des Factures",
              page: "/account-payable/create-vh",
            },
            {
              title: "Liste des factures",
              page: "/account-payable/list-vh",
            },
            {
              title: "Maint des Paiement",
              page: "/account-payable/create-payment",
            },
            {
              title: "Paiement à Rapproché",
              page: "/account-payable/list-payment-rap",
            },
            {
              title: "Liste des Paiements",
              page: "/account-payable/list-payment",
            },
            {
              title: "Maint des Notes de Débit",
              page: "/account-payable/create-note",
            },
            {
              title: "Journal Fournisseur",
              page: "/account-payable/edit-journal-fournisseur",
            },
          ],
        },
        {
          title: "Gestion de Production",
          root: true,
          bullet: "dot",
          icon: "flaticon2-quotation-mark",
          submenu: [
            {
              title: "Maint Ordre de Fabrication",
              page: "/manufacturing/create-order",
            },
            {
              title: "Création des OFs à partir des Commandes",
              page: "/manufacturing/create-wo-so",
            },
            {
              title: "List des OFs",
              page: "/manufacturing/list-wo",
            },
            {
              title: "Lancement OF",
              page: "/manufacturing/launch-order",
            },
            {
              title: "Déclaration Operation",
              page: "/manufacturing/create-op",
            },
            {
              title: "Broyage",
              page: "/manufacturing/create-direct-wo",
            },
            {
              title: "Déclaration Production",
              page: "/manufacturing/worct-entry",
            },
            {
              title: "Déclaration Production Palette",
              page: "/manufacturing/worct-entry-pal",
            },
            {
              title: "Déclaration Consomation",
              page: "/manufacturing/woiss-entry",
            },
            
            
            {
              title: "Cloture OF",
              page: "/manufacturing/edit-wo",
            },
            {
              title: "Calcul Coût Production",
              page: "/manufacturing/calc-cout-wo",
            },
            {
              title: "List Prix de Revient OF",
              page: "/manufacturing/costprice-list",
            },  
          ],
        },
        {
          title: "Gestion des Contrats",
          root: true,
          bullet: "dot",
          icon: "flaticon2-contract",
          submenu: [
            {
              title: "La liste des Contrats",
              page: "/deal/list-deal",
            },
            {
              title: "Ajouter un Contrat",
              page: "/deal/create-deal",
            },
          ],
        },
        {
          title: "Gestion des Employés",
          root: true,
          bullet: "dot",
          icon: "flaticon-users-1",
          submenu: [
            {
              title: "Maint des Employés",
              page: "/accounting-setting/create-employee",
            },
            {
              title: "Liste des Employés",
              page: "/accounting-setting/list-employe",
            },
            {
              title: "Maint Congés des Employés",
              page: "/accounting-setting/create-emp-avail",
            },

            {
              title: "Gestion des Métier",
              root: true,
              bullet: "dot",
              icon: "flaticon-network",
              submenu: [
                {
                  title: "La liste des Code Métiers",
                  page: "/job/list-job",
                },
                {
                  title: "Ajouter un Code Métier",
                  page: "/job/create-job",
                },
              ],
            },
            {
              title: "Pointage des Employés",
              page: "/project/emp-temp",
            },

            {
              title: "Liste des pointages",
              page: "/project/list-emp-temp",
            },
            {
              title: "Calcule paie",
              page: "/project/employe-salary",
            },
          ],
        },
        {
          title: "Gestion des projets",
          root: true,
          bullet: "dot",
          icon: "flaticon2-files-and-folders",
          submenu: [
            {
              title: "La liste Detail des Projets",
              page: "/project/list-project",
            },
            {
              title: "Ajouter un projet",
              page: "/project/create-project",
            },
            {
              title: "mettre A jour Projet",
              page: "/project/update-project",
            },
            {
              title: "La liste des Projets",
              page: "/project/list-pm",
            },
            {
              title: "Lancer un projet",
              page: "/project/launch-project",
            },
            // {
            //   title: "Affectation des Employés",
            //   page: "/project/create-project-payment",
            // },

            {
              title: "Affectation des Employés",
              page: "/accounting-setting/affect-emp",
            },
            {
              title: "Rapport des activités",
              page: "/project/add-report",
            },
            {
              title: "Déclaration de panne des équipements",
              page: "/project/asset-down",
            },
            {
              title: "Déclaration de accident/incident",
              page: "/project/accident-incident",
            },


            {
              title: "Sensibilisation",
              page: "/project/sensibilisation",
            },
            {
              title: "identification",
              page: "/project/identification",
            },

            {
              title: "Gestion des Listes Outils",
              root: true,
              bullet: "dot",
              icon: "flaticon2-tools-and-utensils",
              submenu: [
                {
                  title: "La liste des Listes Outils",
                  page: "/tool/list-tool",
                },
                {
                  title: "Ajouter une Liste Outil",
                  page: "/tool/create-tool",
                },
              ],
            },
            {
              title: "Gestion des Instructions",
              root: true,
              bullet: "dot",
              icon: "flaticon2-sms",
              submenu: [
                {
                  title: "La liste des Instructions",
                  page: "/task/list-task",
                },
                {
                  title: "Ajouter une Instruction",
                  page: "/task/create-task",
                },
              ],
            },

            // {
            //     title: "Création des Projets",

            //     submenu: [

            //     ],
            // },
          ],
        },

        /*{
                    title: "Gestion des Maintenance",
                    bullet: "dot",
                    icon: "flaticon-profile",
                    root: true,
                    submenu: [
                        {
                            title: "La liste des profiles",
                            page: "/profiles/profiles-list",
                        },
                        {
                            title: "Ajouter un profil",
                            page: "/profiles/create-profile",
                        },
                    ],
                },
*/
        {
          title: "Comptabilité Générale",
          bullet: "dot",
          icon: "flaticon2-graphic-design",
          root: true,
          submenu: [
            {
              title: "Affectation Frais d approche",
              page: "/general-accounting/affect-frp",
            },
            {
              title: "Calcul Coût Moyen Pondéré",
              page: "/general-accounting/calc-cmp",
            },
            {
              title: "Maint Ecriture Standard",
              page: "/general-accounting/create-gl",
            },
            {
              title: "Liste des Ecritures ",
              page: "/general-accounting/list-gl",
            },
            {
              title: "Liste  ",
              page: "/general-accounting/list",
            },
          ],
        },

        {
          title: "Supervision",
          bullet: "dot",
          icon: "flaticon-user-settings",
          root: true,
          submenu: [
            {
              title: "Crée demande de chargement",
              page: "/supervision/create-load-request",
            },
            {
              title: "Validation des demandes de chargement",
              page: "/supervision/validate-charge-demande",
            },
            {
              title: "Validation des demandes de dechargement",
              page: "/supervision/validate-decharge-demande",
            },
            {
              title: "Transfert demandes de chargement à la livraison",
              page: "/supervision/transfer-charge-demande-delivery",
            },
          ],
        },
        {
          title: "Gestion des itinéraires",
          bullet: "dot",
          icon: "flaticon2-delivery-truck",
          root: true,
          submenu: [
            {
              title: "Listes des itinéraires",
              page: "/itinerary/list-itinerary",
            },
            {
              title: "Ajouter un itinéraire",
              page: "/itinerary/create-new-itinerary",
            },
          ],
        },
        {
          title: "Gestion des roles",
          bullet: "dot",
          icon: "fab fa-critical-role",
          root: true,
          submenu: [
            {
              title: "Créer un nouveau role",
              page: "/roles/create-new-roles",
            },
            {
              title: "Liste des roles",
              page: "/roles/list-all-roles",
            },
          ],
        },
        {
          title: "Token Series",
          bullet: "dot",
          icon: "flaticon2-list-1",
          root: true,
          submenu: [
            {
              title: "Créer token serie",
              page: "/token-serie/create-new-token",
            },
            {
              title: "Liste des token",
              page: "/token-serie/list-all-tokens",
            },
          ],
        },

        {
          title: "Gestion des services",
          bullet: "dot",
          icon: "flaticon2-checking",
          root: true,
          submenu: [
            {
              title: "Créer un nouveau service",
              page: "/services/create-new-service",
            },
          ],
        },
        {
          title: "Gestion des Transporteurs",
          bullet: "dot",
          icon: "flaticon2-lorry",
          root: true,
          submenu: [
            {
              title: "Ajouter Transporteur",
              page: "/transport/create-transporter",
            },
            {
              title: "Edit Transporteur",
              page: "/transport/list-edit-transporter",
            },
            {
              title: "Liste des Transporteurs",
              page: "/transport/list-transporter",
            },
          ],
        },
        {
          title: "Gestion des utilisateurs",
          bullet: "dot",
          icon: "flaticon-users-1",
          root: true,
          submenu: [
            {
              title: "Gestion des utilisateurs",
              icon: "flaticon-user",
              submenu: [
                {
                  title: "Ajouter un utilisateur",
                  icon: "flaticon-user-add",
                  page: "/users/create-user",
                },
                {
                  title: "La liste des utilisateurs",
                  page: "/users/users-list",
                },
              ],
            },
            {
              title: "Gestion des utilisateurs mobile",
              icon: "flaticon-user",
              submenu: [
                {
                  title: "Ajouter un utilisateur mobile",
                  page: "/users-mobile/create-user-mobile",
                },
                {
                  title: "La liste des utilisateurs mobile",
                  page: "/users-mobile/list-user-mobile",
                },
              ],
            },
          ],
        },
        {
          title: "Gestion des profils",
          bullet: "dot",
          icon: "flaticon-profile-1",
          root: true,
          submenu: [
            {
              title: "Gestion des profils",
              icon: "flaticon-profile",
              submenu: [
                {
                  title: "Ajouter un profil",
                  page: "/profiles/create-profile",
                },
                {
                  title: "liste des profiles",
                  page: "/profiles/profiles-list",
                },
              ],
            },
            {
              title: "Gestion des profils mobiles",
              icon: "flaticon-profile",
              submenu: [
                {
                  title: "Ajouter un profil mobile",
                  page: "/profiles-mobile/create-profile-mobile",
                },
                {
                  title: "Affection des pages produits",
                  page: "/profiles-mobile/assign-profile-products-pages",
                },
                {
                  title: "liste des profiles mobile",
                  page: "/profiles-mobile/profiles-list-mobile",
                },
                {
                  title: "Ajouter un menu mobile",
                  page: "/mobile-menu/create-new-menu",
                },
              ],
            },
          ],
        },
        {
          title: "Paramétrages",
          root: true,
          bullet: "dot",
          icon: "flaticon2-settings",
          submenu: [
            {
              title: "Parametrage Stock",
              root: true,
              bullet: "dot",
              icon: "flaticon-settings-1",
              submenu: [
                {
                  title: "Maint des Sites",
                  page: "/inventory-settings/create-site",
                },
                {
                  title: "List des Sites",
                  page: "/inventory-settings/list-site",
                },

                {
                  title: "Maint des Emplacements",
                  page: "/inventory-settings/create-loc",
                },
                {
                  title: "Liste des Emplacements",
                  page: "/inventory-settings/list-loc",
                },
                {
                  title: "Maint des Status de Stock",
                  page: "/inventory-settings/create-status-stock",
                },
                {
                  title: "List des Status Stock",
                  page: "/inventory-settings/list-status",
                },
              ],
            },
            {
              title: "Paramétrage de production",
              icon: "flaticon2-settings",
              submenu: [
            
                {
                  title: "Maint Code Nomenclature",
                  page: "/manufacturing/create-nomenclature",
                },
                {
                  title: "Maint des Nomenclature",
                  page: "/manufacturing/create-ps",
                },
                {
                  title: "Liste des Nomenclature",
                  page: "/manufacturing/list-ps",
                },
                {
                  title: "Affectation Nomenclature",
                  page: "/manufacturing/affect-bom",
                },
                {
                  title: "Calcul coût des Nomenclatures",
                  page: "/manufacturing/bom-cost",
                },
                {
                  title: "Maint Centre de Charge ",
                  page: "/manufacturing/create-work-center",
                },
                {
                  title: "List des Centres de Charges",
                  page: "/manufacturing/list-work-center",
                },
                {
                  title: "Maint des gammes",
                  page: "/manufacturing/create-gamme",
                },
                {
                  title: "List des Gammes",
                  page: "/manufacturing/list-gamme",
                },
                {
                  title: "Calcul coût des gammes",
                  page: "/manufacturing/ro-cost",
                },
                {
                  title: "Maint des Code Causes",
                  page: "/manufacturing/create-rsn",
                },
                {
                  title: "List des Codes Cause",
                  page: "/manufacturing/list-rsn",
                },
              ],
            },
            {
              title: "Gestion des Devises",
              root: true,
              bullet: "dot",
              icon: "flaticon-settings-1",
              submenu: [
                {
                  title: "Maint des Devises",
                  page: "/devise/create-devise",
                },
                {
                  title: "Liste des Devises",
                  page: "/devise/list-devise",
                },
                {
                  title: "Maint des Taux de Changes",
                  page: "/devise/exchange-rate",
                },
              ],
            },
            {
              title: "Parametrage des Tarif",
              root: true,
              bullet: "dot",
              icon: "flaticon-price-tag",
              submenu: [
                {
                  title: "Maint des Liste Prix",
                  page: "/price-setting/create-price",
                },
                {
                  title: "Liste des liste de Prix",
                  page: "/price-setting/list-price",
                },
              ],
            },

            {
              title: "Parametrage Des Codes",
              root: true,
              bullet: "dot",
              icon: "flaticon-settings-1",
              submenu: [
                {
                  title: "Maint code-mstr",
                  page: "/code-mstr/create-code",
                },
                {
                  title: "Liste des codes",
                  page: "/code-mstr/codes-list",
                },
                {
                  title: "Maint des sequence",
                  page: "/purchasing/create-sequence",
                },
                {
                  title: "Liste des sequence",
                  page: "/purchasing/list-sequence",
                },
              ],
            },
            {
              title: "Parametrage Des Unitées",
              root: true,
              bullet: "dot",
              icon: "flaticon-settings-1",
              submenu: [
                {
                  title: "Maint Unité Mesure",
                  page: "/unit-mesure/create-unit",
                },
                {
                  title: "Liste des Unitées",
                  page: "/unit-mesure/units-list",
                },
              ],
            },

            // NEW
            {
              title: "Parametrage de Qualité",
              root: true,
              bullet: "dot",
              icon: "flaticon-settings-1",
              submenu: [
                {
                  title: "ajouter spécification standard",
                  page: "/inventory-settings/create-standard-specification",
                },
              ],
            },

            {
              title: "Parametrage Comptabilite",
              root: true,
              bullet: "dot",
              icon: "flaticon-settings-1",
              submenu: [
                {
                  title: "Maint Compte",
                  page: "/accounting-setting/create-account",
                },
                {
                  title: "Liste des Compte",
                  page: "/accounting-setting/account-list",
                },
                {
                  title: "Maint des sous comptes",
                  page: "/accounting-setting/sub-account",
                },
                {
                  title: "Liste des sous comptes",
                  page: "/accounting-setting/list-subaccount",
                },
                {
                  title: "Maint des centre de coûts",
                  page: "/accounting-setting/cost-center",
                },
                {
                  title: "Liste des Centres de Coût",
                  page: "/accounting-setting/list-cc",
                },
                {
                  title: "Maint des Agregat",
                  page: "/accounting-setting/agregat",
                },

                {
                  title: "Maint des Journaux",
                  page: "/accounting-setting/journal",
                },
                {
                  title: "Liste des Journaux",
                  page: "/accounting-setting/list-journal",
                },

                {
                  title: "Maint des Lignes de produit",
                  page: "/accounting-setting/product-ligne",
                },
                {
                  title: "Maint des Taxes",
                  page: "/accounting-setting/create-tax",
                },
                {
                  title: "Liste des Taxes",
                  page: "/accounting-setting/taxes-list",
                },

                {
                  title: "Maint des Entitées",
                  page: "/accounting-setting/create-entity",
                },
                {
                  title: "Liste des Entitées",
                  page: "/accounting-setting/entity-list",
                },

                {
                  title: "Maint des Banques",
                  page: "/accounting-setting/create-bank",
                },
                {
                  title: "Liste des Banques",
                  page: "/accounting-setting/bank-list",
                },
                {
                  title: "Maint Methode Paiement",
                  page: "/accounting-setting/create-pay-meth",
                },
                {
                  title: "Liste des Methodes de paiement",
                  page: "/accounting-setting/list-pay-meth",
                },
              ],
            },

            {
              title: "Paramétrages de Transport",
              bullet: "dot",
              icon: "flaticon-settings-1",
              root: true,
              submenu: [
                {
                  title: "Ajouter Code Frais Transport",
                  page: "/transport/create-cost",
                },
                {
                  title: "Edit Code Frais Transport",
                  page: "/transport/list-edit-cost",
                },
                {
                  title: "Liste des Codes Frais Transport",
                  page: "/transport/list-cost",
                },

                {
                  title: "Ajouter Liste Frais Transport",
                  page: "/transport/create-costlist",
                },
                {
                  title: "Edit Liste Frais Transport",
                  page: "/transport/list-edit-costlist",
                },
                {
                  title: "Liste des Liste Frais Transport",
                  page: "/transport/list-costlist",
                },
              ],
            },
            {
              title: "Paramétrages POS",
              bullet: "dot",
              icon: "flaticon-settings-1",
              root: true,
              submenu: [
                {
                  title: "Listes des Plateformes",
                  page: "/pos-settings/list-delivery",
                },
                {
                  title: "Ajouter une Plateforme",
                  page: "/pos-settings/create-delivery",
                },
                {
                  title: "Ajouter une catégorie",
                  page: "/pos-settings/create-category",
                },
                {
                  title: "Liste des catégories",
                  page: "/pos-settings/list-category",
                },
              ],
            },
            {
              title: "Paramétrages des imprimantes",
              bullet: "dot",
              icon: "flaticon-settings-1",
              root: true,
              submenu: [
                {
                  title: "Ajouter une imprimantes",
                  page: "/setting-printers/add-printer",
                },
                {
                  title: "Affecter une imprimante",
                  page: "/setting-printers/set-printer",
                },
                {
                  title: "Liste des imprimantes",
                  page: "/setting-printers/list-printers",
                },
              ],
            },
    
            {
              title: "Paramétrages Mobile",
              bullet: "dot",
              icon: "flaticon-interface-1",
              root: true,
              submenu: [
                {
                  title: "Résultat de la visite",
                  page: "/mobile-settings/visit-result",
                },
                {
                  title: "Méthode de paiement",
                  page: "/mobile-settings/payment-method",
                },
                {
                  title: "Motif d'annulation",
                  page: "/mobile-settings/cancelation-reason",
                },
              ],
            },
    
           

            {
              title: "Configuration Module",
              page: "/config/maint-config",
            },
          ],
        },

        {
          title: "",
          bullet: "",
          icon: "",
          root: true,
        },
      ],
    },
  };

  public get configs(): any {
    return this.defaults;
  }
}
