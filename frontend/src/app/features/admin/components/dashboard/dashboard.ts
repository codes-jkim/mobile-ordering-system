import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { InitialFocusDirective } from '../../../../shared/directives/initial-focus';
import { SalesByDate, TopProductsByCategory } from '../../../../shared/models/order.model';
import { OrderService } from '../../../orders/services/order.service';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatDividerModule,
    BaseChartDirective,
    MatProgressSpinnerModule,
    InitialFocusDirective,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  dailyOrdersCount = 0;
  weeklyOrdersCount = 0;
  dailyRevenue = 0;
  weeklyRevenue = 0;
  topProductsByCategory: TopProductsByCategory[] = [];

  salesChartData: ChartData<'bar' | 'line'> = { datasets: [], labels: [] };

  private orderService = inject(OrderService);

  salesChartOptions: ChartOptions = {};
  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.orderService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dailyOrdersCount = stats.dailyOrders;
        this.weeklyOrdersCount = stats.weeklyOrders;
        this.dailyRevenue = stats.dailyRevenue;
        this.weeklyRevenue = stats.weeklyRevenue;
        this.topProductsByCategory = stats.topProductsByCategory;

        this.initSalesChart(stats.salesByDate);
      },
      error: (err) => {
        console.error('Failed to load dashboard data:', err);
      },
    });
    this.salesChartOptions = {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        'y-axis-count': {
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
        },
        'y-axis-sales': {
          type: 'linear',
          position: 'left',
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      aspectRatio: 5 / 3,
      plugins: {
        legend: {
          position: 'top',
        },
        datalabels: {
          display: function (context): boolean {
            const isOrderCountDataset = context.datasetIndex === 0;
            const value = context.dataset.data[context.dataIndex];

            if (typeof value === 'number') {
              return isOrderCountDataset && value > 0;
            }
            return false;
          },
          anchor: 'start',
          align: 'start',
          borderRadius: 4,
          padding: 6,
          font: {
            weight: 'bold',
          },
          backgroundColor: '#964900',
          color: '#fff',
        },
      },
      layout: {
        padding: 20,
      },
    };
  }

  initSalesChart(salesData: SalesByDate[]): void {
    const salesMap = new Map(salesData.map((item) => [item.date, item]));

    const labels: string[] = [];
    const totalSalesData: number[] = [];
    const orderCountData: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dateString = date.toISOString().split('T')[0];
      labels.push(dateString);

      const dataForDate = salesMap.get(dateString);
      if (dataForDate) {
        totalSalesData.push(dataForDate.total);
        orderCountData.push(dataForDate.count);
      } else {
        totalSalesData.push(0);
        orderCountData.push(0);
      }
    }

    this.salesChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Order Count',
          data: orderCountData,
          type: 'line',
          yAxisID: 'y-axis-count',
          borderColor: '#964900',
          tension: 0.1,
        },
        {
          label: 'Total Sales',
          data: totalSalesData,
          type: 'bar',
          yAxisID: 'y-axis-sales',
          backgroundColor: '#ffb787',
        },
      ],
    };
  }
}
