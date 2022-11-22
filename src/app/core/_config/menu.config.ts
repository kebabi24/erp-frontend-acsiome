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
                    icon: "flaticon2-shopping-cart",
                    root: true,
                    submenu: [
                        {
                            title: "Dashboard",
                            page: "/dashboard/manager-dashboard",
                        },
                        
                    ],
                },
                {
                    title: "Pos",
                    bullet: "dot",
                    icon: "flaticon2-shopping-cart",
                    root: true,
                    page: "/pos",
                },
                {
                    title: "Paramétrages",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-delivery-truck",
                    submenu: [
                        
                        {
                            title: "Parametrage Stock",
                            root: true,
                            bullet: "dot",
                            icon: "flaticon2-delivery-truck",
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
                            icon: "flaticon2-delivery-truck",
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
                            ]
                        },
                        {
                            title: "Parametrage des Tarif",
                            root: true,
                            bullet: "dot",
                            icon: "flaticon2-delivery-truck",
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
                            icon: "flaticon2-settings",
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
                            icon: "flaticon2-settings",
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
                            title: 'Parametrage Comptabilite',
                            root: true,
                            bullet: 'dot',
                            icon: 'flaticon-profile-1',
                            submenu: [
                                {
                                    title: 'Maint Compte',
                                    page: '/accounting-setting/create-account',
                                },
                                {
                                    title: 'Liste des Compte',
                                    page: '/accounting-setting/account-list',
                                },
                                {
                                    title: 'Maint des sous comptes',
                                    page: '/accounting-setting/sub-account',
                                },
                                {
                                    title: 'Liste des sous comptes',
                                    page: '/accounting-setting/list-subaccount',
                                },
                                {
                                    title: 'Maint des centre de coûts',
                                    page: '/accounting-setting/cost-center',
                                },
                                {
                                    title: 'Liste des Centres de Coût',
                                    page: '/accounting-setting/list-cc',
                                },
                                {
                                    title: 'Maint des Agregat',
                                    page: '/accounting-setting/agregat',
                                },
                                
                                {
                                    title: 'Maint des Journaux',
                                    page: '/accounting-setting/journal',
                                },
                                {
                                    title: 'Liste des Journaux',
                                    page: '/accounting-setting/list-journal',
                                },
                                
                                {
                                    title: 'Maint des Lignes de produit',
                                    page: '/accounting-setting/product-ligne',
                                },
                                {
                                    title: 'Maint des Taxes',
                                    page: '/accounting-setting/create-tax',
                                },
                                {
                                    title: 'Liste des Taxes',
                                    page: '/accounting-setting/taxes-list',
                                },
                                
                                {
                                    title: 'Maint des Entitées',
                                    page: '/accounting-setting/create-entity',
                                },
                                {
                                    title: 'Liste des Entitées',
                                    page: '/accounting-setting/entity-list',
                                },
                                {
                                    title: 'Maint des Employés',
                                    page: '/accounting-setting/create-employee',
                                },
                                {
                                    title: 'Liste des Employés',
                                    page: '/accounting-setting/list-employe',
                                },
                                {
                                    title: 'Maint Congés des Employés',
                                    page: '/accounting-setting/create-emp-avail',
                                },
                                
                                {
                                    title: 'Maint des Banques',
                                    page: '/accounting-setting/create-bank',
                                },
                                {
                                    title: 'Liste des Banques',
                                    page: '/accounting-setting/bank-list',
                                },
                                {
                                    title: 'Maint Methode Paiement',
                                    page: '/accounting-setting/create-pay-meth',
                                },
                                {
                                    title: 'Liste des Methodes de paiement',
                                    page: '/accounting-setting/list-pay-meth',
                                },
        
        
        
                            ]
                        },
                        {
                            title: "Configuration Module",
                            page: "/config/maint-config",
                        },
                    ]
                },
                {
                    title: "Gestion des Fournisseurs",
                    bullet: "dot",
                    icon: "flaticon2-shopping-cart",
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
                    ],
                },
                {
                    title: "Gestion des Clients",
                    bullet: "dot",
                    icon: "flaticon2-shopping-cart",
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
                    icon: "flaticon2-shopping-cart",
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
                    ],
                },
                {
                    title: "Gestion des itinéraires",
                    bullet: "dot",
                    icon: "flaticon2-shopping-cart",
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
                            title: "MAINT des Articles",
                            page: "/articles/add",
                        },
                        {
                            title: "MAINT Cout Article",
                            page: "/articles/edit-cost",
                        },
                    ],
                },
                
                {
                    title: "Gestion Stock",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-delivery-truck",
                    submenu: [
                        {
                            title: "Réception OA",
                            page: "/inventory-transaction/po-receip",
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
                            title: 'Gestion des inventaires',
                            submenu:[
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
                            ]
                        }
                    ]
                },
                
                
                {    
                    title: "Gestion des achats",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon-cart",
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
                            title: "Calcule des commandes",
                            page: "/purchasing/create-oa",
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
                    title: "Gestion des Ventes",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon-cart",
                    submenu: [
                        {
                            title: "Rapport Journalier",
                            page: "/sales/dayly-site-trans",
                        },
                        
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
                            title: "Impression Facture en Attente ",
                            page: "/sales/print-invoice",
                        },
                        {
                            title: "Imputation Facture ",
                            page: "/sales/input-invoice",
                        },
                        {
                            title: "Liste des Factures",
                            page: "/sales/invoice-list",
                        },
                        {
                            title: "Consultation des Ventes",
                            page: "/sales/list-sales",
                        },
                        {
                            title: "Consultation des Commandes",
                            page: "/sales/list-pos",
                        },
                    ],
                },
                {
                    title: "Comptabilité Client",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-delivery-truck",
                    submenu: [
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
                    ]
                },
                {
                    title: "Comptabilité Fournisseur",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-delivery-truck",
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
                    ]
                },
                {
					title: 'Gestion de Production',
					root: true,
                    bullet: "dot",
                    icon: "flaticon-cart",
                    submenu: [
						{
							title: 'Maint Ordre de Fabrication',
							page: '/manufacturing/create-order',
						},
                        {
							title: 'Cloture OF',
							page: '/manufacturing/edit-wo',
						},
                        {
							title: 'List des OFs',
							page: '/manufacturing/list-wo',
						},
						{
							title: 'Lancement OF',
							page: '/manufacturing/launch-order',
						},
						{
							title: 'Maint Centre de Charge ',
							page: '/manufacturing/create-work-center',
						},
                        {
							title: 'List des Centres de Charges',
							page: '/manufacturing/list-work-center',
						},
						{
							title: 'Maint des gammes',
							page: '/manufacturing/create-gamme',
						},
                        {
							title: 'Maint des Code Causes',
							page: '/manufacturing/create-rsn',
						},
                        {
							title: 'List des Codes Cause',
							page: '/manufacturing/list-rsn',
						},
						{
							title: 'Déclaration Operation',
							page: '/manufacturing/create-op',
						},
						{
							title: 'Maint Code Nomenclature',
							page: '/manufacturing/create-nomenclature',
						},
                        {
							title: 'Maint des Nomenclature',
							page: '/manufacturing/create-ps',
						},
                        {
							title: 'Liste des Nomenclature',
							page: '/manufacturing/list-ps',
						},
						{
							title: 'Déclaration Production',
							page: '/manufacturing/worct-entry',
						},
						{
							title: 'Déclaration Consomation',
							page: '/manufacturing/woiss-entry',
						},
                        {
							title: 'Affectation Nomenclature',
							page: '/manufacturing/affect-bom',
						},
						
					]
				},
                {
                    title: "Gestion des projets",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-delivery-truck",
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
                            title: "La liste des Projets",
                            page: "/project/list-pm",
                        },
                        {
                            title: "Affectation des Employés",
                            page: "/project/create-project",
                        },
                        {
                            title: "Rapport des activités",
                            page: "/project/add-report",
                        },

                        {
                            title: "Gestion des Métier",
                            root: true,
                            bullet: "dot",
                            icon: "flaticon2-delivery-truck",
                            submenu: [
                                {
                                    title: "La liste des Code Métiers",
                                    page: "/job/list-job",
                                },
                                {
                                    title: "Ajouter un Code Métier",
                                    page: "/job/list-job",
        
                                },
        
                                
                            ],
                        },
                        {
                            title: "Gestion des Listes Outils",
                            root: true,
                            bullet: "dot",
                            icon: "flaticon2-delivery-truck",
                            submenu: [
                                {
                                    title: "La liste des Listes Outils",
                                    page: "/tool/list-tool",
                                },
                                {
                                    title: "Ajouter une Liste Outil",
                                    page: "/tool/create-tool",
                                },
                                
                            ]
                        },
                        {
                            title: "Gestion des Instructions",
                            root: true,
                            bullet: "dot",
                            icon: "flaticon2-delivery-truck",
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
                    
                      

                    ]
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
                    icon: "flaticon-profile",
                    root: true,
                    submenu: [
                        {
                            title: "Affectation Frais d approche",
                            page: "/general-accounting/affect-frp",
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
                    title: "Gestion des utilisateurs",
                    bullet: "dot",
                    icon: "flaticon-user",
                    root: true,
                    submenu: [
                        {
                            title: "Gestion des utilisateurs",
                            icon: "flaticon-user",
                            submenu: [
                                {
                                    title: "Ajouter un utilisateur",
                                    page: "/users/create-user",
                                },
                                {
                                    title: "La liste des utilisateurs",
                                    page: "/users/users-list",
                                },
                            ]
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
                            ]
                        },
                        
                        
                        
                    ],
                },
                {
                    title: "Gestion des profils",
                    bullet: "dot",
                    icon: "flaticon-profile",
                    root: true,
                    submenu: [
                        {
                            title: "Gestion des profils",
                            icon: "flaticon-profile",
                            submenu:[
                                {
                                    title: "Ajouter un profil",
                                    page: "/profiles/create-profile",
                                },
                                {
                                    title: "liste des profiles",
                                    page: "/profiles/profiles-list",
                                }, 

                            ]
                            
                        },
                        {
                            title: "Gestion des profils mobiles",
                            icon: "flaticon-profile",
                            submenu:[
                                {
                                    title: "Ajouter un profil mobile",
                                    page: "/profiles-mobile/create-profile-mobile",
                                },
                                {
                                    title: "liste des profiles mobile",
                                    page: "/profiles-mobile/profiles-list-mobile",
                                }, 
                                {
                                    title: "Ajouter un menu mobile",
                                    page: "/mobile-menu/create-new-menu",
                                },

                            ]
                        },
                        
                       
                    ],
                },
                {
                    title: "Gestion des roles",
                    bullet: "dot",
                    icon: "flaticon-profile",
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
                    title: "Gestion des services",
                    bullet: "dot",
                    icon: "flaticon-profile",
                    root: true,
                    submenu: [
                        {
                            title: "Créer un nouveau service",
                            page: "/services/create-new-service",  
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
    }

    public get configs(): any {
        return this.defaults
    }
}
