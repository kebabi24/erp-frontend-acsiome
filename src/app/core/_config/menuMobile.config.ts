export class MenuMobileConfig {
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
                    title: "Créer un nouveau service",
                    bullet: "dot",
                    submenu: [
                        {
                            title: "Créer un nouveau service",
                            page: "/dashboard/manager-dashboard",
                        },
                        
                    ],
                },
                
                {
                    title: "Liste des clients",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-delivery-truck",
                    
                },
                {
                    title: "Demande de chargement",
                    bullet: "dot",
                    icon: "flaticon2-shopping-cart",
                    root: true,
                },
                {
                    title: "Quitter depot",
                    bullet: "dot",
                    icon: "flaticon2-shopping-cart",
                    root: true,
                },
                {
                    title: "Retour depot",
                    bullet: "dot",
                    icon: "flaticon2-box-1",
                    root: true,
                },
                
                {
                    title: "Fermer Service",
                    root: true,
                    bullet: "dot",
                    icon: "flaticon2-delivery-truck",
                },   
            ],
        },
    }

    public get configs(): any {
        return this.defaults
    }
}
