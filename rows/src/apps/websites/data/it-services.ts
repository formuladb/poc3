
    import { putRow } from "../../../core-orm/putRow";
    import { Page } from "../entity/Page";
    import { Section, SubSection } from "../entity/Section";
    
    export default async () => {
    
        

        const page = await putRow(Page, {
            id: "index", title: "FormulaDB Themes", meta: { tenant: "it-services" },
        });
        
        {
            const section = await putRow(Section, {
                id: "indexS2", title: `IT SERVICES`, component: "COVER", subtitle: `Professional Consultants`,
                body: `Lead paragraph providing a short introduction to you website or app,
                    <br>it would be good to keep it under two lines of text
                `,
                mediaUrl: "/formuladb-env/frmdb-apps/it-services/static/3174729__laptop_notebook_macbook_laptop_notebook_macbook_pro_work_3174729.jpg",mediaType: "IMAGE",meta: { tenant: "it-services" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS3", title: `WHAT WE SUPPORT`, component: "CARDS_IMG", subtitle: `IT Services For Any Size Organization`,
                body: ``,
                meta: { tenant: "it-services" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS3sS1", title: `IT Services and Support`, component: "CARD_IMG", subtitle: `Card 1 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/it-services/static/2402637__network_server_system_network_server_system_2402637.jpg",mediaType: "IMAGE",meta: { tenant: "it-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS2", title: `Networking Support`, component: "CARD_IMG", subtitle: `Card 2 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/it-services/static/2688911__security_binary_binary_code_security_binary_binary_code_castle_2688911.jpg",mediaType: "IMAGE",meta: { tenant: "it-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS3", title: `Managed IT Services`, component: "CARD_IMG", subtitle: `Card 3 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/it-services/static/3484137__internet_cyber_network_internet_cyber_network_finger_3484137.jpg",mediaType: "IMAGE",meta: { tenant: "it-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS4", title: `PC and Mac Support`, component: "CARD_IMG", subtitle: `Card 4 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/it-services/static/2450188__binary_hands_keyboard_binary_hands_keyboard_tap_enter_2450188.jpg",mediaType: "IMAGE",meta: { tenant: "it-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS5", title: `Cloud IT Solution`, component: "CARD_IMG", subtitle: `Card 4 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/it-services/static/17686__business_client_cloud_business_client_cloud_communication_17686.jpg",mediaType: "IMAGE",meta: { tenant: "it-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS6", title: `Hardware Services`, component: "CARD_IMG", subtitle: `Card 4 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/it-services/static/1235959__server_cloud_development_server_cloud_development_business_1235959.jpg",mediaType: "IMAGE",meta: { tenant: "it-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS7", title: `Cabling Installation`, component: "CARD_IMG", subtitle: `Card 4 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/it-services/static/5183996__cable_internet_ethernet_cable_internet_ethernet_lan_5183996.jpg",mediaType: "IMAGE",meta: { tenant: "it-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS8", title: `IT Data Services`, component: "CARD_IMG", subtitle: `Card 4 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/it-services/static/2891812__server_technology_web_server_technology_web_data_2891812.jpg",mediaType: "IMAGE",meta: { tenant: "it-services" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS4", title: ``, component: "MEDIA", subtitle: ``,
                body: ``,
                mediaType: "IMAGE",meta: { tenant: "it-services" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS5", title: `Our Mission`, component: "MEDIA", subtitle: ``,
                body: `Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at
                        convallis turpis auctor et. Etiam odio augue, sagittis vel quam quis, ultricies mollis mi. Fusce elementum ipsum a vehicula vehicula.`,
                mediaUrl: "/formuladb-env/frmdb-apps/it-services/static/2899899__data_computer_internet_data_computer_internet_online_www_2899899.jpg",mediaType: "IMAGE",meta: { tenant: "it-services" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS6", title: `Features About Our Support Team`, component: "CARDS_ICO", subtitle: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur.`,
                body: ``,
                meta: { tenant: "it-services" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS6sS1", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-cloud-upload-alt-cloud-upload-import-save-upload",mediaType: "ICON",meta: { tenant: "it-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS6sS2", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-headset-audio-gamer-gaming-listen-live_chat-microphone-shot_caller-sound-support-telemarketer",mediaType: "ICON",meta: { tenant: "it-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS6sS3", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-shield-alt-achievement-award-block-defend-security-winner",mediaType: "ICON",meta: { tenant: "it-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS6sS4", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-server-computer-cpu-database-hardware-network",mediaType: "ICON",meta: { tenant: "it-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS6sS5", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-tasks-checklist-downloading-downloads-loading-progress-project_management-settings-to_do",mediaType: "ICON",meta: { tenant: "it-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS6sS6", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-history-Rewind-clock-reverse-time-time_machine",mediaType: "ICON",meta: { tenant: "it-services" }
                        , section
                    });
        }

}
    