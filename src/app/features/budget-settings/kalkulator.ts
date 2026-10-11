import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Hasil {
  totalPengeluaran: number;
  rataBulanan: number;
  targetTabungan: number;
  sisaDana: number;
  sisaSetelahTabungan: number;
  status: string;
}

@Component({
  selector: 'app-kalkulator',
  imports: [FormsModule],
  templateUrl: './kalkulator.fitur.html',
  styleUrl: './kalkulator.css',
})
export class kalkulator {
  // In nilai awal
  semester = signal(6);
  dana = signal(0);
  ukt = signal(0);
  makan = signal(0);
  transport = signal(0);
  tempatTinggal = signal(0);
  internet = signal(0);
  kuliah = signal(0);
  lainnya = signal(0);
  tabungan = signal(0);

  // Hasil: null = belum dihitung
  hasil = signal<Hasil | null>(null);

  private formatRupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  rp(nilai: number): string {
    return this.formatRupiah.format(nilai);
  }

  // Input angka yang dikosongkan bisa bernilai null, jadikan 0
  private angka(nilai: number | null | undefined): number {
    return nilai ?? 0;
  }

  hitung() {
    const bulan = Math.max(1, this.angka(this.semester()));

  
    const perBulan =   // Biaya per bulan * durasi semester
      this.angka(this.makan()) +
      this.angka(this.transport()) +
      this.angka(this.tempatTinggal()) +
      this.angka(this.internet()) +
      this.angka(this.lainnya());

    // Biaya per semester dijumlahkan sekali
    const perSemester = this.angka(this.ukt()) + this.angka(this.kuliah());
    const totalPengeluaran = perBulan * bulan + perSemester;
    const rataBulanan = totalPengeluaran / bulan;
    const targetTabungan = this.angka(this.tabungan());
    const sisaDana = this.angka(this.dana()) - totalPengeluaran;
    const sisaSetelahTabungan = sisaDana - targetTabungan;

    let status: string;
    if (sisaDana < 0) {
      status = `Dana tidak cukup untuk menutup pengeluaran, kurang ${this.rp(-sisaDana)}.`;
    } else if (sisaSetelahTabungan < 0) {
      status = `Pengeluaran tertutup, tetapi target tabungan masih kurang ${this.rp(-sisaSetelahTabungan)}.`;
    } else {
      status = 'Target tabunganmu tercapai.';
    }

    this.hasil.set({
      totalPengeluaran,
      rataBulanan,
      targetTabungan,
      sisaDana,
      sisaSetelahTabungan,
      status,
    });
  }

  reset() {
    this.semester.set(6);
    this.dana.set(0);
    this.ukt.set(0);
    this.makan.set(0);
    this.transport.set(0);
    this.tempatTinggal.set(0);
    this.internet.set(0);
    this.kuliah.set(0);
    this.lainnya.set(0);
    this.tabungan.set(0);
    this.hasil.set(null);
  }
}
