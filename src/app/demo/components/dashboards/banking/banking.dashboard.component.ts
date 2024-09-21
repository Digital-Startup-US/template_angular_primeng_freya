import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    ConfirmEventType,
    ConfirmationService,
    FilterService,
    MenuItem,
    MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './banking.dashboard.component.html',
})
export class BankingDashboardComponent implements OnInit, OnDestroy {
    // message on top
    msgs1: any = [
        {
            severity: 'custom',
            detail: `👋 Hello! Welcome to Freya! Before start please complete your profile to
        know you better.`,
        },
    ];

    //chart data
    chartData: any; //main chart Data
    chartOptions: any; //main chart options

    //currency charts on top right
    usdChartData: any;
    btcChartData: any;
    poundChartData: any;

    //pie data for expenses
    pieData: any;
    pieOptions: any;

    // dropdown date ranges
    dateRanges: any[] = []; // for main chart
    selectedDate: any;

    dateRanges2: any[] = []; // for pie chart
    selectedDate2: any;

    //credit cards
    cards: any[] = [];
    selectedCard: any;

    // add credit card dialog
    displayBasic = false;
    cardName: any;
    cardno: any;
    cardDate: any;
    cvv: any;

    //accounts for quick actions
    accounts: any;
    accountNumber: any;
    accountName: any;
    selectedAccount: any;
    filteredAccounts: any[] = []; //account filter

    //subscriptions for quick actions
    subscriptions: any;
    selectedSubscription: any;
    subscriptionAccountNo: any;
    filteredSubscriptions: any; //subscription filter

    //quicactions amount $
    amount: any;

    //transactions table data
    transactions: any[] = [];

    // popup menu items for transactions table
    items: MenuItem[] = [];

    //config subscription
    subscription: Subscription;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        private filterService: FilterService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit() {
        //credit card section
        this.cards = [
            {
                logo: 'assets/layout/images/logo-freya-single.svg',
                cardNo: '5454-5454-9999-8888',
                validDate: '05/28',
                name: 'John Doe',
            },
            {
                logo: 'assets/layout/images/logo-freya-single.svg',
                cardNo: '5454-5454-9999-7777',
                validDate: '08/26',
                name: 'John Doe',
            },
        ];

        this.selectedCard = this.cards[0];

        //dropdown date ranges
        this.dateRanges = [
            { name: 'Daily', code: 'DAY' },
            { name: 'Weekly', code: 'WEEK' },
            { name: 'Monthly', code: 'MONTH' },
        ];

        this.dateRanges2 = [
            { name: 'Last 7 Days', code: '7day' },
            { name: 'Last 30 Days', code: '30day' },
            { name: 'Last 90 Days', code: '90day' },
        ];

        this.selectedDate = this.dateRanges[2];

        // accounts data for quick actions
        this.accounts = [
            {
                photo: 'assets/demo/images/avatar/amyelsner.png',
                accountNo: '** 4848',
                name: 'Amy Elsner',
            },
            {
                photo: 'assets/demo/images/avatar/annafali.png',
                accountNo: '** 4848',
                name: 'Anna Fali',
            },
            {
                photo: 'assets/demo/images/avatar/bernardodominic.png',
                accountNo: '** 4848',
                name: 'Bernardo Dominic',
            },
            {
                photo: 'assets/demo/images/avatar/ivanmagalhaes.png',
                accountNo: '** 4848',
                name: 'Ivan Magalhaes',
            },
            {
                photo: 'assets/demo/images/avatar/stephenshaw.png',
                accountNo: '** 4848',
                name: 'Stephen Shaw',
            },
        ];

        // subscriptions data for quick actions
        this.subscriptions = [
            {
                image: '',
                accountNo: '548268',
                name: 'Electric Bill',
                amount: 15,
                due: 'close',
            },
            {
                image: 'assets/demo/images/dashboard/brands/hbo-logo.png',
                accountNo: '845152848',
                name: 'TV Subscription',
                amount: 120,
                due: '',
            },
            {
                image: 'assets/demo/images/dashboard/brands/netflix-logo.png',
                accountNo: '659815523',
                name: 'Netflix Subscription',
                amount: 48,
                due: 'close',
            },
            {
                image: 'assets/demo/images/dashboard/brands/harvard-logo.png',
                accountNo: '*6585122',
                name: 'Education Payment',
                amount: 45,
                due: 'late',
            },
        ];

        // transactions data for table
        this.transactions = [
            {
                image: 'assets/demo/images/avatar/amyelsner.png',
                accountNo: '** 4848',
                action: 'Bank Transfer',
                name: 'Amy Elsner',
                amount: 112.0,
            },
            {
                image: 'assets/demo/images/avatar/annafali.png',
                accountNo: '** 4848',
                action: 'Bank Transfer',
                name: 'Anna Fali',
                amount: -112.0,
            },
            {
                image: 'assets/demo/images/dashboard/brands/netflix-logo.png',
                accountNo: '** 4848',
                action: 'Subscription Payment',
                name: 'Netflix Subscription',
                amount: -48.0,
            },
            {
                image: '',
                accountNo: '** 4848',
                action: 'Bill Payment',
                name: 'Electric Bill',
                amount: -48.0,
            },
            {
                image: 'assets/demo/images/avatar/ivanmagalhaes.png',
                accountNo: '** 4848',
                action: 'Bank Transfer',
                name: 'Ivan Magalhaes',
                amount: -112.0,
            },
            {
                image: 'assets/demo/images/avatar/stephenshaw.png',
                accountNo: '** 4848',
                action: 'Bank Transfer',
                name: 'Stephen Shaw',
                amount: 112.0,
            },
        ];

        //menu items for table
        this.items = [
            {
                icon: 'pi pi-refresh',
                label: 'Re-send or Pay',
            },

            {
                icon: 'pi pi-external-link',
                label: 'Details',
            },
            {
                icon: 'pi pi-download',
                label: 'Download doc',
            },
        ];

        this.initChart();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ],
            datasets: [
                {
                    label: 'Income',
                    data: [
                        8000, 8100, 5600, 5500, 4000, 6500, 5900, 8000, 8100,
                        5600, 5500, 4000,
                    ],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--green-300'),
                    tension: 0.4,
                    borderWidth: 2,
                    backgroundColor: '#4caf5061',
                    borderRadius: 6,
                },
                {
                    label: 'Expenses',
                    data: [
                        1200, 5100, 6200, 3300, 2100, 6200, 4500, 1200, 5100,
                        6200, 3300, 2100,
                    ],

                    borderColor: documentStyle.getPropertyValue('--red-300'),
                    backgroundColor: '#ff3d3238',
                    tension: 0.4,
                    borderWidth: 2,
                    borderRadius: 6,
                },
            ],
        };

        //currency charts on top right
        this.usdChartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'Euro to US Dollar',
                    backgroundColor: documentStyle.getPropertyValue(
                        '--primary-light-color'
                    ),
                    borderColor: documentStyle.getPropertyValue(
                        '--primary-light-color'
                    ),
                    data: [1.1, 1.12, 1.15, 1.18, 1.2, 1.25, 1.3],
                    barThickness: 10,
                },
            ],
        };

        this.btcChartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'Bitcoin to US Dollar',
                    backgroundColor: documentStyle.getPropertyValue(
                        '--primary-light-color'
                    ),
                    borderColor: documentStyle.getPropertyValue(
                        '--primary-light-color'
                    ),
                    data: [35000, 40000, 45000, 55000, 60000, 65000, 60000],
                    barThickness: 10,
                },
            ],
        };

        this.poundChartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'GBP to US Dollar',
                    backgroundColor: documentStyle.getPropertyValue(
                        '--primary-light-color'
                    ),
                    borderColor: documentStyle.getPropertyValue(
                        '--primary-light-color'
                    ),
                    data: [1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6],
                    barThickness: 10,
                },
            ],
        };

        //bar chart options
        this.chartOptions = {
            animation: {
                duration: 0,
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxHeight: 15,
                        pointStyleWidth: 17,
                        padding: 14,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            let label = context.dataset.label || '';

                            if (label) {
                                label += ':';
                            }

                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(context.parsed.y);
                            }
                            return label;
                        },
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
            },
        };

        //pie data and options
        this.pieData = {
            labels: ['Entertainment', 'Platform', 'Shopping', 'Transfers'],
            datasets: [
                {
                    data: [300, 50, 100, 80],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--orange-300'),
                        documentStyle.getPropertyValue('--green-300'),
                        documentStyle.getPropertyValue('--cyan-300'),
                    ],
                    borderColor: surfaceBorder,
                },
            ],
        };

        this.pieOptions = {
            animation: {
                duration: 0,
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 14,
                        boxHeight: 15,
                        pointStyleWidth: 17,
                    },
                    position: 'bottom',
                },
            },
        };
    }

    onDateChangeBarChart() {
        const documentStyle = getComputedStyle(document.documentElement);

        const monthlyData = {
            labels: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ],
            datasets: [
                {
                    label: 'Income',
                    data: [
                        8000, 8100, 5600, 5500, 4000, 6500, 5900, 8000, 8100,
                        5600, 5500, 4000,
                    ],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--green-300'),
                    tension: 0.4,
                    borderWidth: 2,
                    backgroundColor: '#4caf5061',
                    borderRadius: 6,
                },
                {
                    label: 'Expenses',
                    data: [
                        1200, 5100, 6200, 3300, 2100, 6200, 4500, 1200, 5100,
                        6200, 3300, 2100,
                    ],

                    borderColor: documentStyle.getPropertyValue('--red-300'),
                    backgroundColor: '#ff3d3238',
                    tension: 0.4,
                    borderWidth: 2,
                    borderRadius: 6,
                },
            ],
        };

        const dailyData = {
            labels: [
                'Day 1',
                'Day 2',
                'Day 3',
                'Day 4',
                'Day 5',
                'Day 6',
                'Day 7',
                'Day 8',
                'Day 9',
                'Day 10',
                'Day 11',
                'Day 12',
                'Day 13',
                'Day 14',
                'Day 15',
                'Day 16',
                'Day 17',
                'Day 18',
                'Day 19',
                'Day 20',
                'Day 21',
                'Day 22',
                'Day 23',
                'Day 24',
                'Day 25',
                'Day 26',
                'Day 27',
                'Day 28',
                'Day 29',
                'Day 30',
            ],
            datasets: [
                {
                    label: 'Income',
                    data: [
                        100, 200, 150, 50, 75, 150, 200, 250, 300, 400, 350,
                        500, 550, 700, 600, 650, 550, 450, 350, 300, 250, 200,
                        150, 100, 50, 75, 150, 200, 250,
                    ],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--green-300'),
                    tension: 0.4,
                    borderWidth: 2,
                    backgroundColor: '#4caf5061',
                    borderRadius: 6,
                },
                {
                    label: 'Expenses',
                    data: [
                        75, 150, 100, 200, 250, 300, 350, 400, 450, 550, 600,
                        650, 550, 700, 600, 550, 350, 400, 300, 250, 200, 150,
                        100, 50, 75, 150, 200, 250, 300,
                    ],

                    borderColor: documentStyle.getPropertyValue('--red-300'),
                    backgroundColor: '#ff3d3238',
                    tension: 0.4,
                    borderWidth: 2,
                    borderRadius: 6,
                },
            ],
        };

        const weeklyData = {
            labels: [
                'Week 1',
                'Week 2',
                'Week 3',
                'Week 4',
                'Week 5',
                'Week 6',
                'Week 7',
                'Week 8',
                'Week 9',
                'Week 10',
                'Week 11',
                'Week 12',
                'Week 13',
                'Week 14',
                'Week 15',
                'Week 16',
                'Week 17',
                'Week 18',
                'Week 19',
                'Week 20',
                'Week 21',
                'Week 22',
                'Week 23',
                'Week 24',
            ],
            datasets: [
                {
                    label: 'Income',
                    data: [
                        2500, 2000, 1500, 1000, 500, 2000, 2500, 3000, 3500,
                        4000, 4500, 5000, 6000, 7000, 6000, 5000, 4000, 3500,
                        3000, 2500, 2000, 1500, 1000, 500,
                    ],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--green-300'),
                    tension: 0.4,
                    borderWidth: 2,
                    backgroundColor: '#4caf5061',
                    borderRadius: 6,
                },
                {
                    label: 'Expenses',
                    data: [
                        1500, 1000, 500, 2000, 2500, 3000, 3500, 4000, 4500,
                        5000, 6000, 7000, 6000, 5000, 4000, 3500, 3000, 2500,
                        2000, 1500, 1000, 500, 2000, 2500,
                    ],

                    borderColor: documentStyle.getPropertyValue('--red-300'),
                    backgroundColor: '#ff3d3238',
                    tension: 0.4,
                    borderWidth: 2,
                    borderRadius: 6,
                },
            ],
        };

        let newBarData = { ...this.chartData };
        switch (this.selectedDate.name) {
            case 'Monthly':
                newBarData = monthlyData;
                break;
            case 'Weekly':
                newBarData = weeklyData;
                break;
            case 'Daily':
                newBarData = dailyData;
                break;
            default:
                break;
        }

        this.chartData = newBarData;
    }

    onDateChangePieChart() {
        const documentStyle = getComputedStyle(document.documentElement);

        const last30Data = {
            labels: ['Entertainment', 'Platform', 'Shopping', 'Transfers'],
            datasets: [
                {
                    data: [300, 50, 100, 80],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--orange-300'),
                        documentStyle.getPropertyValue('--green-300'),
                        documentStyle.getPropertyValue('--cyan-300'),
                    ],
                },
            ],
        };

        const last7Data = {
            labels: ['Entertainment', 'Platform', 'Shopping', 'Transfers'],
            datasets: [
                {
                    data: [450, 50, 200, 120],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--orange-300'),
                        documentStyle.getPropertyValue('--green-300'),
                        documentStyle.getPropertyValue('--cyan-300'),
                    ],
                },
            ],
        };

        const last90Data = {
            labels: ['Entertainment', 'Platform', 'Shopping', 'Transfers'],
            datasets: [
                {
                    data: [30, 200, 150, 20],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--orange-300'),
                        documentStyle.getPropertyValue('--green-300'),
                        documentStyle.getPropertyValue('--cyan-300'),
                    ],
                },
            ],
        };

        let newPieData = { ...this.pieData };
        switch (this.selectedDate2.code) {
            case '7day':
                newPieData = last7Data;
                break;
            case '30day':
                newPieData = last30Data;
                break;
            case '90day':
                newPieData = last90Data;
                break;
            default:
                break;
        }

        this.pieData = newPieData;
    }

    filterAccounts(event: any) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < this.accounts.length; i++) {
            let country = this.accounts[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.filteredAccounts = filtered;
    }

    filterSubscription(event: any) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < this.subscriptions.length; i++) {
            let country = this.subscriptions[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.filteredSubscriptions = filtered;
    }

    showBasicDialog() {
        this.displayBasic = true;
    }

    addCreditCard() {
        const card = {
            logo: 'assets/layout/images/logo-freya-single.svg',
            cardNo: this.cardno,
            validDate: this.cardDate,
            name: this.cardName,
        };
        this.cards.push(card);
        this.displayBasic = false;
    }

    //table filter
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    //confirm dialogs for quick actions
    confirm1(name: any, amount: any) {
        this.confirmationService.confirm({
            message:
                'Are you sure that you want to send $' +
                amount +
                ' to ' +
                name +
                '?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: 'You sent $' + amount + ' to ' + name,
                });
            },
            reject: (type: any) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Rejected',
                            detail: 'Your transaction rejected',
                        });
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Cancelled',
                            detail: 'Your transaction canceled',
                        });
                        break;
                }
            },
        });
    }

    confirm2(name: any, amount: any) {
        this.confirmationService.confirm({
            message:
                'Are you sure that you want to pay $' +
                amount +
                ' for your ' +
                name +
                '?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: 'You paid $' + amount + ' for your ' + name,
                });
            },
            reject: (type: any) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Rejected',
                            detail: 'Your transaction rejected',
                        });
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Cancelled',
                            detail: 'Your transaction canceled',
                        });
                        break;
                }
            },
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}