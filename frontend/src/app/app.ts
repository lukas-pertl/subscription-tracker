import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionModel, SubscriptionService } from './services/subscriptionService';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private subService = inject(SubscriptionService);

  subscriptions = signal<SubscriptionModel[]>([]);
  currentSub: SubscriptionModel = this.getEmptySub();
  isEditing = signal<boolean>(false);

  nameError = signal<string>('');
  categoryError = signal<string>('');
  priceError = signal<string>('');
  dateError = signal<string>('');

  categoryPresets: string[] = [
    'Entertainment',
    'Streaming',
    'Software & Cloud',
    'Gaming',
    'Gesundheit & Sport',
    'Versicherung & Wohnen',
    'Mobilfunk & Internet'
  ];

  searchTerm = signal<string>('');
  selectedCategory = signal<string>('ALL');
  statusFilter = signal<'ALL' | 'ACTIVE' | 'PAUSED'>('ALL');

  currentPage = signal<number>(1);
  pageSize = 6;

  availableCategories = computed(() => {
    const cats = this.subscriptions()
      .map(s => s.category)
      .filter(c => !!c && c.trim() !== '');
    return Array.from(new Set(cats)).sort();
  });

  filteredAndSortedSubscriptions = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const cat = this.selectedCategory();
    const status = this.statusFilter();

    return this.subscriptions()
      .filter(sub => {
        const matchesSearch =
          !term ||
          sub.name.toLowerCase().includes(term) ||
          sub.category.toLowerCase().includes(term);

        const matchesCategory = cat === 'ALL' || sub.category === cat;

        const matchesStatus =
          status === 'ALL' ||
          (status === 'ACTIVE' && sub.active) ||
          (status === 'PAUSED' && !sub.active);

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (a.active !== b.active) {
          return a.active ? -1 : 1;
        }
        const dateA = a.nextBillingDate ? new Date(a.nextBillingDate).getTime() : Number.MAX_SAFE_INTEGER;
        const dateB = b.nextBillingDate ? new Date(b.nextBillingDate).getTime() : Number.MAX_SAFE_INTEGER;
        return dateA - dateB;
      });
  });

  pagedSubscriptions = computed(() => {
    const all = this.filteredAndSortedSubscriptions();
    const start = (this.currentPage() - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredAndSortedSubscriptions().length / this.pageSize) || 1;
  });

  totalMonthlyCost = computed(() =>
    this.subscriptions()
      .filter(s => s.active)
      .reduce((sum, s) => sum + (s.monthlyCost ?? 0), 0)
  );

  totalYearlyCost = computed(() => this.totalMonthlyCost() * 12);

  activeCount = computed(() =>
    this.subscriptions().filter(s => s.active).length
  );

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.subService.getAll().subscribe(data => {
      this.subscriptions.set(data);
      if (this.currentPage() > this.totalPages()) {
        this.currentPage.set(this.totalPages());
      }
    });
  }

  validateInputs(): boolean {
    let isValid = true;
    const trimmedName = this.currentSub.name.trim();
    const trimmedCategory = this.currentSub.category.trim();

    if (!trimmedName) {
      this.nameError.set('Bitte gib einen Anbieter oder Namen ein.');
      isValid = false;
    } else if (trimmedName.length < 2) {
      this.nameError.set('Der Name muss mindestens 2 Zeichen lang sein.');
      isValid = false;
    } else {
      this.nameError.set('');
    }

    if (!trimmedCategory) {
      this.categoryError.set('Bitte wähle oder tippe eine Kategorie ein.');
      isValid = false;
    } else {
      this.categoryError.set('');
    }

    const priceInput = String(this.currentSub.price ?? '').trim();
    const numberRegex = /^\d+([.,]\d{1,2})?$/;

    if (!priceInput) {
      this.priceError.set('Bitte gib einen Betrag ein.');
      isValid = false;
    } else if (!numberRegex.test(priceInput)) {
      this.priceError.set('Bitte gib nur gültige Zahlen ein (z.B. 9.99).');
      isValid = false;
    } else {
      const parsedPrice = parseFloat(priceInput.replace(',', '.'));
      if (parsedPrice <= 0) {
        this.priceError.set('Der Betrag muss größer als 0,00 € sein.');
        isValid = false;
      } else {
        this.currentSub.price = parsedPrice;
        this.priceError.set('');
      }
    }

    // Datums-Validierung: Darf nicht in der Vergangenheit liegen
    if (!this.currentSub.nextBillingDate) {
      this.dateError.set('Bitte wähle ein Datum aus.');
      isValid = false;
    } else {
      const selectedDate = new Date(this.currentSub.nextBillingDate);
      selectedDate.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        this.dateError.set('Das Datum darf nicht in der Vergangenheit liegen.');
        isValid = false;
      } else {
        this.dateError.set('');
      }
    }

    return isValid;
  }

  selectCategoryPreset(preset: string): void {
    this.currentSub.category = preset;
    this.categoryError.set('');
  }

  saveSubscription(): void {
    if (!this.validateInputs()) return;

    this.currentSub.name = this.currentSub.name.trim();
    this.currentSub.category = this.currentSub.category.trim();

    if (this.isEditing() && this.currentSub.id) {
      this.subService.update(this.currentSub.id, this.currentSub).subscribe(() => {
        this.loadSubscriptions();
        this.resetForm();
      });
    } else {
      this.subService.create(this.currentSub).subscribe(() => {
        this.loadSubscriptions();
        this.resetForm();
        this.currentPage.set(1);
      });
    }
  }

  editSubscription(sub: SubscriptionModel): void {
    this.currentSub = { ...sub };
    this.clearErrors();
    this.isEditing.set(true);
  }

  toggleActive(sub: SubscriptionModel): void {
    if (!sub.id) return;
    const updated = { ...sub, active: !sub.active };
    this.subService.update(sub.id, updated).subscribe(() => {
      this.loadSubscriptions();
    });
  }

  deleteSubscription(id?: number): void {
    if (!id) return;
    this.subService.delete(id).subscribe(() => {
      this.loadSubscriptions();
    });
  }

  isDueSoon(dateStr: string, active: boolean): boolean {
    if (!dateStr || !active) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    const diffDays = (target.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diffDays >= -1 && diffDays <= 14;
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('ALL');
    this.statusFilter.set('ALL');
    this.currentPage.set(1);
  }

  resetForm(): void {
    this.currentSub = this.getEmptySub();
    this.clearErrors();
    this.isEditing.set(false);
  }

  private clearErrors(): void {
    this.nameError.set('');
    this.categoryError.set('');
    this.priceError.set('');
    this.dateError.set('');
  }

  private getEmptySub(): SubscriptionModel {
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 1);
    return {
      name: '',
      category: '',
      price: 9.99,
      billingCycle: 'MONTHLY',
      nextBillingDate: defaultDate.toISOString().split('T')[0],
      active: true
    };
  }
}