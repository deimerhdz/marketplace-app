import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

export type StrawType = 'CONVENTIONAL' | 'SEXED' | 'SEXED_MALE';

export interface ShippingAddressDto {
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface OrderDto {
  id: string;
  customerId: string;
  supplierId: string;
  total: number;
  shippingAddress: ShippingAddressDto;
  orderStatus: OrderStatus;
  createdAt: string;
}

export interface OrderItemResponseDto {
  id: string;
  sku: string;
  bullName: string;
  orderId: string;
  type: StrawType;
  quantity: number;
  price: number;
  subtotal: number;
}
@Component({
  selector: 'app-order-list-page',
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './order-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrderListPage implements OnInit {
  orders = signal<OrderDto[]>([]);
  selectedOrder = signal<OrderDto | null>(null);
  selectedItems = signal<OrderItemResponseDto[]>([]);
  newStatus = signal<OrderStatus>('PENDING');
  showModal = signal(false);
  saving = signal(false);

  readonly statuses: OrderStatus[] = [
    'PENDING',
    'PAID',
    'PROCESSING',
    'SHIPPED',
    'COMPLETED',
    'CANCELLED',
  ];

  // Mock data
  ngOnInit(): void {
    this.orders.set([
      {
        id: 'aaa-001',
        customerId: 'cust-1',
        supplierId: 'sup-1',
        total: 850000,
        orderStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        shippingAddress: {
          street: 'Cra 10 #20-30',
          city: 'Bogotá',
          state: 'Cundinamarca',
          country: 'Colombia',
        },
      },
      {
        id: 'aaa-002',
        customerId: 'cust-2',
        supplierId: 'sup-1',
        total: 425000,
        orderStatus: 'PAID',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        shippingAddress: {
          street: 'Calle 5 #8-12',
          city: 'Medellín',
          state: 'Antioquia',
          country: 'Colombia',
        },
      },
      {
        id: 'aaa-003',
        customerId: 'cust-3',
        supplierId: 'sup-1',
        total: 1200000,
        orderStatus: 'SHIPPED',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        shippingAddress: {
          street: 'Av 3N #15-40',
          city: 'Cali',
          state: 'Valle del Cauca',
          country: 'Colombia',
        },
      },
    ]);
  }

  openModal(order: OrderDto): void {
    this.selectedOrder.set(order);
    this.newStatus.set(order.orderStatus);
    // Aquí cargarías los items de la orden:
    // this._ordersService.getItems(order.id).subscribe(...)
    this.selectedItems.set([
      {
        id: '1',
        sku: 'PAJ-001',
        bullName: 'Toro Bravo',
        orderId: order.id,
        type: 'CONVENTIONAL',
        quantity: 5,
        price: 40000,
        subtotal: 200000,
      },
      {
        id: '2',
        sku: 'PAJ-002',
        bullName: 'Toro Bravo',
        orderId: order.id,
        type: 'SEXED',
        quantity: 3,
        price: 85000,
        subtotal: 255000,
      },
    ]);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedOrder.set(null);
  }

  updateStatus(): void {
    const order = this.selectedOrder();
    if (!order) return;

    this.saving.set(true);

    // this._ordersService.updateStatus(order.id, this.newStatus()).subscribe({
    //   next: () => {
    //     this.orders.update(list =>
    //       list.map(o => o.id === order.id ? { ...o, orderStatus: this.newStatus() } : o)
    //     );
    //     this.saving.set(false);
    //     this.closeModal();
    //   },
    //   error: () => this.saving.set(false),
    // });

    // Mock:
    setTimeout(() => {
      this.orders.update((list) =>
        list.map((o) => (o.id === order.id ? { ...o, orderStatus: this.newStatus() } : o)),
      );
      this.saving.set(false);
      this.closeModal();
    }, 800);
  }

  statusConfig(status: OrderStatus): { label: string; badge: string } {
    const map: Record<OrderStatus, { label: string; badge: string }> = {
      PENDING: { label: 'Pendiente', badge: 'badge-warning' },
      PAID: { label: 'Pagado', badge: 'badge-info' },
      PROCESSING: { label: 'En proceso', badge: 'badge-primary' },
      SHIPPED: { label: 'Enviado', badge: 'badge-accent' },
      COMPLETED: { label: 'Completado', badge: 'badge-success' },
      CANCELLED: { label: 'Cancelado', badge: 'badge-error' },
    };
    return map[status];
  }
}
