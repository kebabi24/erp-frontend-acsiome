export class MenuTrConfig {
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
          { section: "MENUS GENERALS", toolbar },
          {
            title: "Dashboard Formation",
            bullet: "dot",
            icon: "flaticon-dashboard",
            page: "/dashboard/dd-dashboard",
          },
          // {
          //   title: "Dashboard",
          //   bullet: "dot",
          //   icon: "flaticon-dashboard",
          //   root: true,
          //   submenu: [
          //     {
          //       title: "Dashboard",
          //       page: "/dashboard/manager-dashboard",
          //     },
          //     {
          //       title: "Dashboard Commercial",
          //       page: "/dashboard/commercial-dashboard",
          //     },
          //     {
          //       title: "Dashboard CRM",
          //       page: "/dashboard/crm-dashboard",
          //     },
          //     {
          //       title: "Dashboard Formation",
          //       page: "/dashboard/dd-dashboard",
          //     },
          //   ],
          // },
          {
            title: "Gestion de Formations",
            bullet: "dot",
            icon: "flaticon-presentation",
            page: "/training/gestion-de-formation",
          },
          {
            title: "Sessions",
            bullet: "dot",
            icon: "flaticon-presentation",
            page: "/training/training-session-list",
          },
          {
            title: "Formation",
            bullet: "dot",
            icon: "flaticon-doc",
            page: "/training/list-training",
          },
          {
            title: "Programme de Formation",
            bullet: "dot",
            icon: "flaticon-event-calendar-symbol",
            page: "/training/create-training-calander",
          },
          {
            title: "Formateurs",
            bullet: "dot",
            icon: "flaticon-businesswoman",
            page: "/providers/create-rep-job",
          },
          {
            title: "Etudiants",
            bullet: "dot",
            icon: "flaticon-customer",
            page: "/accounting-setting/list-employe",
          },
          {
            title: "Salles",
            bullet: "dot",
            icon: "flaticon-squares-4",
            page: "/inventory-settings/list-loc",
          },
          {
            title: "Gestion Des Formations",
            bullet: "dot",
            icon: "flaticon-presentation-1",
            root: true,
            submenu: [
              {
                title: "Création Formation",
                page: "/training/create-training",
              },
              {
                title: "Modification Des Formation",
                page: "/training/update-training",
              },
              {
                title: "Liste Des Formations",
                page: "/training/list-training",
              },
              
              {
                title: "Création session de Formation",
                page: "/training/create-training-session",
              },
              {
                title: "Liste session de Formation",
                page: "/training/training-session-list",
              },
              {
                title: "Lancement session de Formation",
                page: "/training/launch-training-session",
              },
              {
                title: "Rapport de Formation",
                page: "/training/training-report",
              },
              {
                title: "Liste Rapport de Formation",
                page: "/training/training-report-list",
              },
              {
                title: "évaluation à chaud Formation",
                page: "/training/training-hot-eval",
              },
              {
                title: "évaluation à froid Formation",
                page: "/training/training-cold-eval",
              },
              {
                title: "Liste des évaluations Formation",
                page: "/training/training-eval-list",
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
                title: "Ajouter Fournisseurs",
                page: "/providers/add",
              },
              {
                title: "La liste des Fournisseurs",
                page: "/providers/providers-list",
              },
              {
                title: "Répertoire Fournisseurs Formateurs",
                page: "/providers/create-rep-job",
              },
              {
                title: "Liste Répertoire Fournisseurs",
                page: "/providers/list-rep",
              },
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
                title: "Répertoire Fournisseurs",
                page: "/providers/create-rep-job",
              },
              
              
            ],
          },
          {
            title: "Charges",
            bullet: "dot",
            icon: "flaticon2-list",
            page: "/account-payable/create-charge-payment",
          },
          {
            title: "Gestion des demandes de formations",
            root: true,
            bullet: "dot",
            icon: "flaticon2-shopping-cart",
            submenu: [
              {
                title: "Demande de Formation Par Employée",
                page: "/training/create-request-group",
              },
              {
                title: "Demande de Compétence",
                page: "/training/create-training-request",
              },
              {
                title: "Demande de Formation Par Service",
                page: "/training/create-request-group",
              },
              {
                title: "Demande de Formation",
                page: "/training/create-req-training",
              },
                        
              {
                title: "Liste des Demandes ",
                page: "/purchasing/req-list",
              },
              {
                title: "Approuver Demande de Formation",
                page: "/training/approval-req",
              },
              {
                title: "Approbation Demande",
                page: "/purchasing/purchase-order-approval",
              },
              {
                title: "Approbation des Demandes globales",
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
              
            ],
          },
          {
            title: "Commerciale",
            bullet: "dot",
            icon: "flaticon-network",
            page: "/customers/customer-list",
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
                title: "Liste Répertoire Clients",
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
            title: "Gestion des Employés",
            root: true,
            bullet: "dot",
            icon: "flaticon-users-1",
            submenu: [
              {
                title: "Maint des employés",
                page: "/accounting-setting/create-employee",
              },
              {
                title: "Liste des employés",
                page: "/accounting-setting/list-employe",
              },
              // {
              //   title: "Maint Congés des Employés",
              //   page: "/accounting-setting/create-emp-avail",
              // },
  
              {
                title: "Ajout Population",
                page: "/training/create-population",
              },
              {
                title: "Liste des Population",
                page: "/training/list-population",
              },
              {
                title: "Modification des Population",
                page: "/training/update-population",
              },
              {
                title: "Gestion des Competences",
                root: true,
                bullet: "dot",
                icon: "flaticon-network",
                submenu: [
                  {
                    title: "La liste des Code Competences",
                    page: "/job/list-job",
                  },
                  {
                    title: "Ajouter un Code Competence",
                    page: "/job/create-job",
                  },
                ],
              },
            
            ],
          },
          {
            title: "Gestion des Consommables",
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
                title: "Ajouter des Articles",
                page: "/articles/add",
              },
              {
                title: "Génerer Bien via Modèle",
                page: "/articles/create-mp-mod",
              },
              {
                title: "Génerer Intrants via Modèle",
                page: "/articles/create-div-mod",
              },
              
              {
                title: "MAINT Cout Article",
                page: "/articles/edit-cost",
              },
              
  
              {
                title: "Gestion des Modèles",
                icon: "flaticon2-delivery-package",
                submenu: [
                  {
                    title: "Ajouter Un Modèle mp",
                    page: "/articles/create-mod-mp",
                  },
                  {
                    title: "Ajouter Un Modèle Divers",
                    page: "/articles/create-mod-div",
                  },
                  
                  {
                    title: "Liste des Modèles",
                    page: "/articles/list-mod",
                  },
                  {
                    title: "Modification des Modèle",
                    page: "/articles/update-mod",
                  },
                ],
              },
            ],
          },
          {
            title: "Moyens Généraux",
            bullet: "dot",
            icon: "flaticon2-delivery-package",
            page: "/inventory-transaction/inventory-list",
          },
          {
            title: "Gestion Achats & Stock",
            root: true,
            bullet: "dot",
            icon: "flaticon2-delivery-package",
            submenu: [
              {
                title: "Réception stocks ",
                page: "/inventory-transaction/unplanified-recept",
              },
              {
                title: "Transfert stocks",
                page: "/inventory-transaction/transfer",
              },
              {
                title: "Sortie stocks ",
                page: "/inventory-transaction/unplanified-issue",
              },
              
              {
                title: "saisie Prix Récéption",
                page: "/inventory-transaction/update-price-unp",
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
                title: "Paiement des Récéption",
                page: "/purchasing/payment-au",
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
          {
            title: "Gestion Commerciale",
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
                title: "Déblocage commande",
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
                title: "Génération des ventes",
                page: "/sales/create-psh",
              },
              {
                title: "Versement Client",
                page: "/sales/create-payment-cust",
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
                title: "Paiement à Rapprocher",
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
            title: "Gestion des Caisses",
            root: true,
            bullet: "dot",
            icon: "flaticon2-delivery-package",
            submenu: [
             
              
              {
                title: "Transfert Entre Caisse",
                page: "/account-receivable/transfert-ar",
              },
              {
                title: "Liste des Transferts Recettes ",
                page: "/account-receivable/list-transfert-payment",
              },
              {
                title: "Réglement Charge",
                page: "/account-payable/create-charge-payment",
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
                title: "Ajouter un utilisateur",
                icon: "flaticon-user-add",
                page: "/users/create-user",
              },
              {
                title: "La liste des utilisateurs",
                page: "/users/users-list",
              },
              
              // {
              //   title: "Gestion des utilisateurs mobile",
              //   icon: "flaticon-user",
              //   submenu: [
              //     {
              //       title: "Ajouter un utilisateur mobile",
              //       page: "/users-mobile/create-user-mobile",
              //     },
              //     {
              //       title: "La liste des utilisateurs mobile",
              //       page: "/users-mobile/list-user-mobile",
              //     },
              //   ],
              // },
            ],
          },
          {
            title: "Gestion des profils",
            bullet: "dot",
            icon: "flaticon-profile-1",
            root: true,
            submenu: [
              {
                title: "Ajouter un profil",
                page: "/profiles/create-profile",
              },
              {
                title: "liste des profils",
                page: "/profiles/profiles-list",
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
                  {
                    title: "ajouter Code Mesure",
                    page: "/manufacturing/create-nomenclature",
                  },
                  {
                    title: "Liste des codes mesures",
                    page: "/manufacturing/list-bom",
                  },
                  {
                    title: "ajouter des composants d'accompagnemnt",
                    page: "/manufacturing/create-ps",
                  },
                  {
                    title: "Liste des composants",
                    page: "/manufacturing/list-ps",
                  },
                  
                ],
              },
              {
                title: "Parametrage Des Salles de formation",
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
                title: "Parametrage des Devises",
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
                title: "Parametrage des Formation",
                root: true,
                bullet: "dot",
                icon: "flaticon-settings-1",
                submenu: [
                  {
                    title: "Type de Formation",
                    page: "/training/create-training-type",
                  },
                  {
                    title: "Domaine de Formation",
                    page: "/training/create-training-domain",
                  },
                  {
                    title: "Liste des Domaines de Formation",
                    page: "/training/list-domain",
                  },
                  {
                    title: "Rubrique de Formation",
                    page: "/training/create-training-section",
                  },
                  {
                    title: "Liste des Domaines de Formation",
                    page: "/training/list-section",
                  },
                  
                ],
              },
              {
                title: "Parametrage des évaluations",
                root: true,
                bullet: "dot",
                icon: "flaticon-settings-1",
                submenu: [
                  {
                    title: "ajouter parametres evaluation",
                    page: "/inventory-settings/create-standard-specification",
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
  