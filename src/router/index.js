import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../pages/LandingPage.vue'
import Login from '../pages/Login.vue'
import Panel from '../pages/Panel.vue'
import Profile from '../pages/Profile.vue'
import Financial from '../pages/Financial.vue'
import Faq from '../pages/Faq.vue'

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: Landing
    },
    {
        path: '/management',
        name: 'Management',
        component: () => import("../pages/Management.vue"),
    },
    {
        path: '/flights',
        name: 'FlightsLanding',
        component: () => import("../pages/Flights.vue"),
    },
    {
        path: '/login/:role',
        name: 'Login',
        component: Login
    },
    {
        path: '/faq',
        name: 'Faq',
        component: Faq
    },

    // company
    {
        path: '/company',
        name: 'company',
        redirect: '/company/users/applicants',
        component: Panel,
        children: [
            {
                path: "requests",
                name: "OperatorRequests",
                component: () => import("../pages/applicant/Requests.vue")
            },

            {
                path: "histories",
                name: "OperatorHistories",
                component: () => import("../pages/operator/ServiceHistories.vue"),
            },

            {
                path: "users",
                name: "CompanyUsers",
                component: () => import("../pages/operator/Users.vue"),
                children: [
                    {
                        path: "applicants",
                        name: "CompanyUsersApplicants",
                        component: () => import("../views/operator/users/ApplicantList.vue")
                    },

                    {
                        path: "servants",
                        name: "CompanyUsersServants",
                        component: () => import("../views/operator/users/ServantsList.vue")
                    },

                    {
                        path: "others",
                        name: "CompanyUsersOthers",
                        component: () => import("../views/operator/users/OtherUsersList.vue")
                    },
                ]
            },

            {
                path: "applicants/:id",
                name: "OperatorApplicant2",
                component: () => import("../pages/operator/ApplicantProfile.vue"),
                children: [
                    {
                        path: "",
                        name: "OperatorApplicantCurrent2",
                        component: () => import("../views/operator/profiles/History.vue"),
                        children: [
                            {
                                path: "currents",
                                name: "OperatorApplicantCurrent2",
                                component: () => import("../views/operator/profiles/CurrentRequests.vue")
                            },
                            {
                                path: "histories",
                                name: "OperatorApplicantCurrent3",
                                component: () => import("../views/operator/profiles/ServiceHistories.vue")
                            },
                        ]
                    },

                ]
            },

            {
                path: "servants/:id",
                name: "OperatorServant2",
                component: () => import("../pages/operator/ServantProfile.vue"),

            },

            {
                path: "transactions",
                name: "companyTransactions",
                component: () => import("../pages/experts/financial/Transactions.vue")
            },

            {
                path: "accounts",
                name: "companyServantBankAccounts",
                component: () => import("../pages/financial/BankAccounts.vue")
            },

            {
                path: "wallet",
                name: "companyServantWallet",
                component: () => import("../pages/financial/Wallet.vue")
            },

            {
                path: 'serviceRequest',
                name: 'CompanyRequest',
                redirect: '/company/serviceRequest/service',
                component: () => import("../pages/applicant/ServiceRequest.vue"),
                children: [
                    {
                        path: 'service',
                        component: () =>
                            import("../views/applicant/serviceRequest/Service.vue")
                    },
                    {
                        path: 'terrain',
                        component: () =>
                            import("../views/applicant/serviceRequest/Terrain.vue")
                    },
                    {
                        path: 'location',
                        component: () =>
                            import("../views/applicant/serviceRequest/Location.vue")
                    },
                    {
                        path: 'allocate',
                        component: () =>
                            import("../views/applicant/serviceRequest/Allocate.vue")
                    },
                    {
                        path: 'confirmation',
                        component: () =>
                            import("../views/applicant/serviceRequest/Confirmation.vue")
                    }
                ]
            },
        ]
    },


    // supporter
    {
        path: "/supporter",
        name: "Supporter",
        component: Panel,
        children: [
            {
                path: '',
                component: () =>
                    import("../views/supporter/Tickets.vue"),
            },
            {
                path: 'ticket/:id',
                component: () =>
                    import("../views/supporter/Messages.vue"),
            },
        ]
    },


    // financial
    {
        path: '/financial',
        name: 'FinancialExpert',
        redirect: '/financial/services',
        component: Panel,
        children: [
            {
                path: 'services',
                name: 'FinancialPastServices',
                redirect: '/financial/services/calculating',
                component: () =>
                    import("../pages/experts/financial/PastServices.vue"),
                children: [

                    {
                        path: 'calculating',
                        name: 'pastServicesCalculating',
                        component: () =>
                            import("../views/experts/financial/pastServices/CalculatingList.vue"),
                    },
                    {
                        path: 'calculated',
                        name: 'pastServicesCalculated',
                        component: () =>
                            import("../views/experts/financial/pastServices/CalculatedList.vue"),
                    },
                    {
                        path: 'refined',
                        name: 'pastServicesRefined',
                        component: () =>
                            import("../views/experts/financial/pastServices/RefinedList.vue"),
                    },

                ],
            },

            {
                path: 'requests',
                name: 'FinancialPayRequest',
                redirect: 'financial/awaiting',
                component: () =>
                    import("../pages/experts/financial/PayRequests.vue"),
                children: [
                    {
                        path: 'new',
                        name: 'payRequestRequests',
                        component: () =>
                            import("../views/experts/financial/payRequests/RequestsList.vue"),
                    },
                    {
                        path: 'awaiting',
                        name: 'payRequestAwaiting',
                        component: () =>
                            import("../views/experts/financial/payRequests/AwaitingList.vue"),
                    },
                    {
                        path: 'cleared',
                        name: 'payRequestCleared',
                        component: () =>
                            import("../views/experts/financial/payRequests/ClearedList.vue"),
                    },


                ],
            },

            {
                path: "transactions",
                name: "FinancialTransactions",
                component: () => import("../pages/experts/financial/Transactions.vue")
            },

            {
                path: 'offline-payments',
                name: 'FinancialOfflinePayments',
                redirect: '/financial/offline-payments/new',
                component: () =>
                    import("../pages/experts/financial/OfflinePayments.vue"),
                children: [
                    {
                        path: 'new',
                        name: 'OfflinePayments',
                        component: () =>
                            import("../views/experts/financial/offlinePayments/New.vue"),
                    },
                    {
                        path: 'verified',
                        name: 'OfflinePaymentsVerify',
                        component: () =>
                            import("../views/experts/financial/offlinePayments/Verified.vue"),
                    },
                    {
                        path: 'rejected',
                        name: 'OfflinePaymentsReject',
                        component: () =>
                            import("../views/experts/financial/offlinePayments/Rejected.vue"),
                    },


                ],
            },
        ],
    },

    // allocator
    {
        path: '/allocator',
        name: 'AllocatorPanel',
        component: Panel,
        redirect: '/allocator/',
        children: [
            {
                path: '',
                name: 'Allocator',
                redirect: '/allocator/request',
                component: () => import("../pages/experts/allocator/Allocator.vue"),
                children: [
                    {
                        path: 'request',
                        name: 'AllocatorRequest',
                        component: () => import("../views/experts/allocator/Request.vue"),
                    },
                    {
                        path: 'allocated',
                        name: 'AllocatorAllocation',
                        component: () => import("../views/experts/allocator/Allocated.vue"),
                    },
                    {
                        path: 'history',
                        name: 'AllocatorPast',
                        component: () => import("../views/experts/allocator/History.vue"),
                    }
                ],
            },

            {
                path: "identities",
                name: "operatorIdentities",
                component: () => import("../pages/operator/Identities.vue")
            },

            {
                path: "identity/:id",
                name: "OperatorDocuments",
                redirect: '/identity/:id/national-card',
                component: () => import("../pages/operator/Identity.vue"),
                children: [
                    {
                        path: "national-card",
                        name: "operatorNationalCard",
                        component: () => import("../views/operator/identity/NationalCard.vue"),
                    },
                    {
                        path: "plaque",
                        name: "operatorPlaque",
                        component: () => import("../views/operator/identity/Plaque.vue"),
                    },
                    {
                        path: "degree-education",
                        name: "operatorDegreeEducation",
                        component: () => import("../views/operator/identity/DegreeEducation.vue"),
                    },
                    {
                        path: "certificate",
                        name: "operatorCertificate",
                        component: () => import("../views/operator/identity/Certificate.vue"),
                    },
                    {
                        path: "repersenter",
                        name: "operatorRepersenter",
                        component: () => import("../views/operator/identity/Representer.vue"),
                    },
                    {
                        path: "no-criminal-record",
                        name: "operatorNoCriminalRecord",
                        component: () => import("../views/operator/identity/NoCriminalRecord.vue"),
                    },
                ],
            },

            {
                path: "discounts",
                name: "operatorDiscounts",
                component: () => import("../pages/operator/Discounts.vue")
            },

            {
                path: "services",
                name: "operatorServices",
                component: () => import("../pages/operator/Services.vue")
            },


            {
                path: "poisons",
                name: "operatorPoisons",
                component: () => import("../pages/operator/Poisons.vue")
            },

            {
                path: "users",
                name: "OperatorUsers",
                component: () => import("../pages/operator/Users.vue"),
                children: [
                    {
                        path: "applicants",
                        name: "OperatorUsersApplicants",
                        component: () => import("../views/operator/users/ApplicantList.vue")
                    },

                    {
                        path: "servants",
                        name: "OperatorUsersServants",
                        component: () => import("../views/operator/users/ServantsList.vue")
                    },

                    {
                        path: "others",
                        name: "OperatorUsersOthers",
                        component: () => import("../views/operator/users/OtherUsersList.vue")
                    },
                ]
            },

            {
                path: "applicants/:id",
                name: "OperatorApplicant",
                component: () => import("../pages/operator/ApplicantProfile.vue")
            },

            {
                path: "servants/:id",
                name: "OperatorServant",
                component: () => import("../pages/operator/ServantProfile.vue")
            },

            {
                path: "others/:id",
                name: "OperatorOther",
                component: () => import("../pages/operator/OtherProfile.vue")
            },

            {
                path: "requests",
                name: "AllocatorRequests",
                component: () => import("../pages/applicant/Requests.vue")
            },

            {
                path: 'serviceRequest',
                name: 'AllocatorServiceRequest',
                redirect: '/allocator/serviceRequest/service',
                component: () => import("../pages/applicant/ServiceRequest.vue"),
                children: [
                    {
                        path: 'service',
                        component: () =>
                            import("../views/applicant/serviceRequest/Service.vue")
                    },
                    {
                        path: 'terrain',
                        component: () =>
                            import("../views/applicant/serviceRequest/Terrain.vue")
                    },
                    {
                        path: 'location',
                        component: () =>
                            import("../views/applicant/serviceRequest/Location.vue")
                    },
                    {
                        path: 'allocate',
                        component: () =>
                            import("../views/applicant/serviceRequest/Allocate.vue")
                    },
                    {
                        path: 'confirmation',
                        component: () =>
                            import("../views/applicant/serviceRequest/Confirmation.vue")
                    }
                ]
            },
        ],
    },

    // servant
    {
        path: '/servant',
        name: 'Servant',
        component: Panel,
        redirect: '/servant/requests',
        children: [
            {
                path: 'support',
                name: 'ServantSupport',
                component: () => import("../pages/Support.vue"),
                children: [
                    {
                        path: 'tickets',
                        name: 'ServantTickets',
                        component: () =>
                            import("../views/support/Tickets.vue"),
                    },
                    {
                        path: 'ticket/:id',
                        name: 'ServantMessages',
                        component: () =>
                            import("../views/support/Messages.vue"),
                    }
                ]
            },

            {
                path: 'identities',
                name: 'TestIdentities',
                component: () => import("../pages/servant/Identities.vue")
            },

            {
                path: 'profile',
                name: 'ProfileServant',
                component: Profile
            },
            {
                path: "transactions",
                name: "FinancialServantTransactions",
                component: () => import("../pages/financial/Transactions.vue")
            },
            {
                path: "accounts",
                name: "FinancialServantBankAccounts",
                component: () => import("../pages/financial/BankAccounts.vue")
            },
            {
                path: "wallet",
                name: "FinancialServantWallet",
                component: () => import("../pages/financial/Wallet.vue")
            },

            {
                path: 'support',
                name: 'FaqServant',
                component: Faq
            },
            {
                path: 'services',
                name: 'PickServices',
                component: () =>
                    import("../pages/servant/PickServices.vue")
            },
            {
                path: 'places',
                name: 'CoverdPlaces',
                component: () =>
                    import("../pages/servant/CoverdPlaces.vue")
            },
            {
                path: 'timings',
                name: 'Timings',
                component: () =>
                    import("../pages/servant/Timings.vue")
            },

            {
                path: 'requests',
                name: 'ServantRequests',
                redirect: '/servant/requests/new',
                component: () =>
                    import("../pages/servant/Requests.vue"),
                children: [
                    {
                        path: 'published',
                        name: 'ServantRequestPublish',
                        component: () =>
                            import("../views/servant/requests/Published.vue"),
                    },
                    {
                        path: 'new',
                        name: 'ServantRequestNew',
                        component: () =>
                            import("../views/servant/requests/New.vue"),
                    },
                    {
                        path: 'doing',
                        name: 'ServantRequestDoing',
                        component: () =>
                            import("../views/servant/requests/Doing.vue"),
                    },
                    {
                        path: 'history',
                        name: 'ServantRequestHistory',
                        component: () =>
                            import("../views/servant/requests/History.vue"),
                    },
                ]

            }
        ]
    },

    // applicant
    {
        path: '/applicant',
        name: 'Applicant',
        component: Panel,
        redirect: '/applicant/requests/',
        children: [
            {
                path: 'support',
                component: () => import("../pages/Support.vue"),
                children: [
                    {
                        path: 'tickets',
                        name: 'Tickets',
                        component: () =>
                            import("../views/support/Tickets.vue"),
                    },
                    {
                        path: 'ticket/:id',
                        name: 'Messages',
                        component: () =>
                            import("../views/support/Messages.vue"),
                    }
                ]
            },
            {
                path: 'profile',
                name: 'ProfileApplicant',
                component: Profile
            },
            {
                path: 'financial',
                name: 'FinancialApplicant',
                component: Financial,
            },
            {
                path: "transactions",
                name: "FinancialApplicantTransactions",
                component: () => import("../pages/financial/Transactions.vue")
            },
            {
                path: "accounts",
                name: "FinancialApplicantBankAccounts",
                component: () => import("../pages/financial/BankAccounts.vue")
            },
            {
                path: "wallet",
                name: "FinancialApplicantWallet",
                component: () => import("../pages/financial/Wallet.vue")
            },
            {
                path: 'faq',
                name: 'FaqApplicant',
                component: Faq
            },
            {
                path: 'serviceRequest',
                name: 'ServiceRequest',
                redirect: '/applicant/serviceRequest/service',
                component: () => import("../pages/applicant/ServiceRequest.vue"),
                children: [
                    {
                        path: 'service',
                        component: () =>
                            import("../views/applicant/serviceRequest/Service.vue")
                    },
                    {
                        path: 'terrain',
                        component: () =>
                            import("../views/applicant/serviceRequest/Terrain.vue")
                    },
                    {
                        path: 'location',
                        component: () =>
                            import("../views/applicant/serviceRequest/Location.vue")
                    },
                    {
                        path: 'confirmation',
                        component: () =>
                            import("../views/applicant/serviceRequest/Confirmation.vue")
                    }
                ]
            },
            {
                path: 'requests',
                name: 'requestsApplicant',
                component: () =>
                    import("../pages/applicant/Requests.vue")
            },
            {
                path: 'histories',
                name: 'PastServiceApplicant',
                component: () =>
                    import("../pages/applicant/PastService.vue")
            },


            {
                path: 'servant/:id',
                name: 'ServantProfile',
                component: () =>
                    import("../pages/applicant/ServantProfile.vue")
            },
        ]
    },

    //monitoring
    {
        path: '/monitoring',
        name: 'Monitoring',
        redirect: 'monitoring/requests',
        component: Panel,
        children: [
            {
                path: '',
                name: 'MonitoringHome',
                component: () => import("../pages/experts/monitoring/Monitoring.vue"),
                children: [
                    {
                        path: 'requests',
                        name: 'MonitoringRequest',
                        component: () => import("../views/experts/monitoring/ServiceRequests.vue"),
                    },
                    {
                        path: 'histories',
                        name: 'MonitoringPast',
                        component: () => import("../views/experts/monitoring/PastServices.vue"),
                    },
                ],
            }
        ]
    },


    //flight
    {
        path: '/flight',
        name: 'FlightPanel',
        component: Panel,
        redirect: '/flight/identities',
        children: [
            {
                path: '',
                name: 'Flights',
                redirect: '/flight/request',
                component: () => import("../pages/experts/allocator/Allocator.vue"),
                children: [
                    {
                        path: 'request',
                        name: 'FlightRequest',
                        component: () => import("../views/experts/allocator/Request.vue"),
                    },
                    {
                        path: 'allocated',
                        name: 'FlightAllocation',
                        component: () => import("../views/experts/allocator/Allocated.vue"),
                    },
                    {
                        path: 'history',
                        name: 'FlightPast',
                        component: () => import("../views/experts/allocator/History.vue"),
                    }
                ],
            },

            {
                path: "identities",
                name: "flightIdentities",
                component: () => import("../pages/operator/Identities.vue")
            },

            {
                path: "identity/:id",
                name: "FlightDocuments",
                redirect: '/identity/:id/national-card',
                component: () => import("../pages/operator/Identity.vue"),
                children: [
                    {
                        path: "national-card",
                        name: "FlightNationalCard",
                        component: () => import("../views/operator/identity/NationalCard.vue"),
                    },
                    {
                        path: "plaque",
                        name: "FlightPlaque",
                        component: () => import("../views/operator/identity/Plaque.vue"),
                    },
                    {
                        path: "degree-education",
                        name: "FlightDegreeEducation",
                        component: () => import("../views/operator/identity/DegreeEducation.vue"),
                    },
                    {
                        path: "certificate",
                        name: "FlightCertificate",
                        component: () => import("../views/operator/identity/Certificate.vue"),
                    },
                    {
                        path: "repersenter",
                        name: "FlightRepersenter",
                        component: () => import("../views/operator/identity/Representer.vue"),
                    },
                    {
                        path: "no-criminal-record",
                        name: "FlightNoCriminalRecord",
                        component: () => import("../views/operator/identity/NoCriminalRecord.vue"),
                    },
                ],
            },

            {
                path: "users",
                name: "FlightUsers",
                component: () => import("../pages/operator/Users.vue"),
                children: [
                    {
                        path: "applicants",
                        name: "FlightUsersApplicants",
                        component: () => import("../views/operator/users/ApplicantList.vue")
                    },

                    {
                        path: "servants",
                        name: "FlightUsersServants",
                        component: () => import("../views/operator/users/ServantsList.vue")
                    },

                    {
                        path: "others",
                        name: "FlightUsersOthers",
                        component: () => import("../views/operator/users/OtherUsersList.vue")
                    },
                ]
            },

            {
                path: "applicants/:id",
                name: "FlightApplicant",
                component: () => import("../pages/operator/ApplicantProfile.vue")
            },

            {
                path: "servants/:id",
                name: "FlightServant",
                component: () => import("../pages/operator/ServantProfile.vue")
            },
        ]

    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router