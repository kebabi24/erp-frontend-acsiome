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
              {
                title: "Dashboard DD",
                page: "/dashboard/dd-dashboard",
              },
            ],
          },
          {
            title: "Gestion Des Formations",
            bullet: "dot",
            icon: "flaticon-event-calendar-symbol",
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
            //   {
            //     title: "Pointage des Employés",
            //     page: "/project/emp-temp",
            //   },
  
            //   {
            //     title: "Liste des pointages",
            //     page: "/project/list-emp-temp",
            //   },
            //   {
            //     title: "Calcule paie",
            //     page: "/accounting-setting/employe-salary",
            //   },
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
                title: "Parametrage des Formation",
                root: true,
                bullet: "dot",
                icon: "flaticon-settings-1",
                submenu: [
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
  