export class MenuDDConfig {
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
                page: "/dashboard/sales-dashboard",
              },
              {
                title: "Dashboard CRM",
                page: "/dashboard/crm-dashboard",
              },
              {
                title: "Dashboard DD",
                page: "/dashboard/dd-dashboard",
              },
            ],
          },
  
          // CRM
            
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
                page: "/promo/promo-cust-add",
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
  
          /**/
          
  
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
              {
                title: "Liste Soldes clients",
                page: "/customers/customers-solde",
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
            title: "Préparation Sortie Camion",
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
                title: "Transfert à la livraison",
                page: "/supervision/transfer-charge-demande-delivery",
              },
              {
                title: "Service roadmap",
                page: "/supervision/dashboard-service",
              },
              
              {
                title: "Créer un nouveau service",
                page: "/services/create-new-service",
              },
              {
                title: "Consultation des Services",
                page: "/services/list-service",
              },
              {
                title: "Validation des demandes de dechargement",
                page: "/supervision/validate-decharge-demande",
              },
              {
                title: "Décompte Role",
                page: "/supervision/decompte-role",
              },
              {
                title: "Impression Facture Camion",
                page: "/supervision/print-inventory-role",
              },
              {
                title: "Export Demande Chargement",
                page: "/supervision/export-lr",
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
                title: "Crée Demande Chargement",
                page: "/supervision/create-lr-sup",
              },
              {
                title: "Validation des Demandes de Chargement Sup",
                page: "/supervision/validate-lr-sup",
              },
              // {
              //   title: "Validation des demandes de dechargement",
              //   page: "/supervision/validate-decharge-demande",
              // },
              // {
              //   title: "Transfert demandes de chargement à la livraison",
              //   page: "/supervision/transfer-charge-demande-delivery",
              // },
              {
                title: "Liste des Chargement non Respectés",
                page: "/supervision/list-diff-loadrequest",
              },
              {
                title: "Liste des Factures Par Role",
                page: "/supervision/list-invoice-role",
              },
              {
                title: "Liste des Payments Par Role ",
                page: "/supervision/list-payment-role",
              },
              {
                title: "Liste des Visites Par Role ",
                page: "/supervision/list-visite-role",
              },
              {
                title: "Liste des Ventes Par Role ",
                page: "/supervision/list-sales-role",
              },
              {
                title: "Stock Camion Valorisé",
                page: "/supervision/list-inventory-role",
              },
              {
                title: "Décompte Role",
                page: "/supervision/decompte-role",
              },
              {
                title: "Export Demande Chargement",
                page: "/supervision/export-lr",
              },
              // {
              //   title: "Service roadmap",
              //   page: "/supervision/dashboard-service",
              // },
              // {
              //   title: "Décompte Role",
              //   page: "/supervision/decompte-role",
              // },
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
              {
                title: "Consultation des Services",
                page: "/services/list-service",
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
                title: "Copie des Articles",
                page: "/articles/list-copie",
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
                title: "Ajouter Article via Modèle",
                page: "/articles/create-item-mod",
              },
              {
                title: "MAINT Cout Article",
                page: "/articles/edit-cost",
              },
              {
                title: "Créer une page de produits",
                page: "/articles/page",
              },
              {
                title: "Modification Prix Pour DD",
                page: "/articles/update-price-dd",
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
                title: "Chargement Des Vans 2",
                page: "/inventory-transaction/loading-vans-v2",
              },
              {
                title: "Chargement Des Vans (scan)",
                page: "/inventory-management/loading-vans-scan",
              },
              {
                title: "Dechargement Des Vans",
                page: "/inventory-management/unloading-vans",
              },
              {
                title: "Chargement Des BLs",
                page: "/sales/create-psh-plq",
              },
              {
                title: "Liste des Chargements ",
                page: "/supervision/list-chargement",
              },
              {
                title: "Consultation demandes de chargement",
                page: "/inventory-management/load-request-list",
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
                title: "Consultation Stocks ",
                page: "/inventory-transaction/inventory-list",
              },
              {
                title: "Consultation des Transactions ",
                page: "/inventory-transaction/transaction-list",
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
            title: "Gestion des Ventes",
            root: true,
            bullet: "dot",
            icon: "flaticon2-delivery-package",
            submenu: [
              {
                title: "Commande Clients",
                page: "/sales/create-so-bc",
              },
              {
                title: "Liste des Commandes",
                page: "/sales/so-list",
              },
              {
                title: "Liste des BLS",
                page: "/sales/list-psh",
              },
              {
                title: "Facturation ",
                page: "/sales/create-invoice",
              },
              {
                title: "Réimpression Facture ",
                page: "/sales/reprint-invoice",
              },
              {
                title: "Liste des Factures",
                page: "/sales/list-invoices",
              },
              
              {
                title: "Ajouter Facture DD",
                page: "/sales/create-inv-mob",
              },
              
              {
                title: "Liste des Factures DD",
                page: "/sales/list-invoice-mob",
              },
              {
                title: "Liste des Ventes DD",
                page: "/sales/list-sales-dd",
              },
              {
                title: "Liste des Paiement DD",
                page: "/sales/list-paiement-mob",
              },
              {
                title: "Liste des Visites",
                page: "/sales/list-visit-mob",
              },
              {
                title: "Chiffre d'affaire Par Client",
                page: "/sales/list-ca-dd",
              },
              {
                title: "Chiffre d'affaire Par Type Produit",
                page: "/sales/list-sales-type",
              },
              {
                title: "Quantitée Vendue Par Role",
                page: "/sales/list-sales-role",
              },
            ],
          },
          // {
          //   title: "Comptabilité Client",
          //   root: true,
          //   bullet: "dot",
          //   icon: "flaticon2-analytics-1",
          //   submenu: [
          //     {
          //       title: "Maint des Paiement",
          //       page: "/account-receivable/create-account-receivable",
          //     },
              
          //     {
          //       title: "Liste des Paiement",
          //       page: "/account-receivable/list-payment",
          //     },
          //     {
          //       title: "Paiement à Rapproché",
          //       page: "/account-receivable/list-payment-rap",
          //     },
          //     {
          //       title: "Maint des Notes de Débit",
          //       page: "/account-receivable/create-note",
          //     },
          //     {
          //       title: "Journal Client",
          //       page: "/account-receivable/edit-journal",
          //     },
          //   ],
          // },
          {
            title: "Gestion des Caisses",
            root: true,
            bullet: "dot",
            icon: "flaticon2-delivery-package",
            submenu: [
              {
                title: "Recette Vendeur",
                page: "/account-receivable/create-vendor-payment",
              },
              {
                title: "Recette Vendeur Détaillée",
                page: "/account-receivable/create-vendor-payment-detail",
              },
              {
                title: "Recette Role Détaillée",
                page: "/account-receivable/create-role-payment-detail",
              },
              {
                title: "Liste des Recettes vendeurs",
                page: "/account-receivable/list-vendor-payment",
              },
              {
                title: "Situation Caisse Détaillée",
                page: "/account-receivable/list-bank-detail",
              },
              {
                title: "Situation des Caisses",
                page: "/account-receivable/list-caisse",
              },
              {
                title: "Transfert Entre Caisse",
                page: "/account-receivable/transfert-ar",
              },
  
              {
                title: "Transfert Entre Caisses Détaillé",
                page: "/account-receivable/transfert-caisse-det",
              },
              {
                title: "Liste des Transferts Recettes ",
                page: "/account-receivable/list-transfert-payment",
              },
              {
                title: "Paiement Dépense Détaillé",
                page: "/account-payable/create-charge-payable-detail",
              },
              {
                title: "Paiement Dépense",
                page: "/account-payable/create-charge-payment",
              },
              {
                title: "Maint des Paiement",
                page: "/account-receivable/create-account-receivable",
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
              {
                title: "Journal De Caisse",
                page: "/account-receivable/bank-journal",
              },
            ],
          },
          {
            title: "Gestion des Dépenses",
            root: true,
            bullet: "dot",
            icon: "flaticon2-rocket",
            submenu: [
              {
                title: "Maint Charge",
                page: "/financialcharge/create-fc",
              },
  
              {
                title: "Liste des charges",
                page: "/financialcharge/list-forcast",
              },
              {
                title: "Modification des charges",
                page: "/financialcharge/update-forcast",
              },
            ],
          },
  
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
          {
            title: "Gestion des profils",
            icon: "flaticon-profile",
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
                title: "liste des profils mobile",
                page: "/profiles-mobile/profiles-list-mobile",
              },
              {
                title: "Ajouter un menu mobile",
                page: "/mobile-menu/create-new-menu",
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
  
              
              {
                title: "Parametrage Comptabilite",
                root: true,
                bullet: "dot",
                icon: "flaticon-settings-1",
                submenu: [
                  {
                    title: "Maint des Taxes",
                    page: "/accounting-setting/create-tax",
                  },
                  {
                    title: "Liste des Taxes",
                    page: "/accounting-setting/taxes-list",
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
                  {
                    title: "Liste de prix",
                    page: "/mobile-settings/price-list",
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
  