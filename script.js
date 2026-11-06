// To-Do List sederhana dengan penyimpanan di localStorage.
const KUNCI = 'todo-list-app';

const form = document.getElementById('form-tugas');
const input = document.getElementById('input-tugas');
const daftar = document.getElementById('daftar');
const hitung = document.getElementById('hitung');
const tombolFilter = document.querySelectorAll('.filter button');
const tombolHapusSelesai = document.getElementById('hapus-selesai');

let tugas = muat();
let filterAktif = 'semua';

function muat() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI)) || [];
  } catch (e) {
    return [];
  }
}

function simpan() {
  localStorage.setItem(KUNCI, JSON.stringify(tugas));
}

function tambah(teks) {
  tugas.push({ id: Date.now(), teks: teks, selesai: false });
  simpan();
  render();
}

function ubahStatus(id) {
  const t = tugas.find((x) => x.id === id);
  if (t) t.selesai = !t.selesai;
  simpan();
  render();
}

function hapus(id) {
  tugas = tugas.filter((x) => x.id !== id);
  simpan();
  render();
}

function tersaring() {
  if (filterAktif === 'aktif') return tugas.filter((t) => !t.selesai);
  if (filterAktif === 'selesai') return tugas.filter((t) => t.selesai);
  return tugas;
}

function render() {
  daftar.innerHTML = '';
  const data = tersaring();

  if (data.length === 0) {
    const kosong = document.createElement('li');
    kosong.className = 'kosong';
    kosong.textContent = 'Belum ada tugas.';
    daftar.appendChild(kosong);
  }

  data.forEach((t) => {
    const li = document.createElement('li');
    li.className = 'item' + (t.selesai ? ' selesai' : '');

    const cek = document.createElement('input');
    cek.type = 'checkbox';
    cek.checked = t.selesai;
    cek.setAttribute('aria-label', 'Tandai selesai: ' + t.teks);
    cek.addEventListener('change', () => ubahStatus(t.id));

    const teks = document.createElement('span');
    teks.textContent = t.teks; // textContent mencegah injeksi HTML

    const tombol = document.createElement('button');
    tombol.type = 'button';
    tombol.className = 'hapus';
    tombol.textContent = '×';
    tombol.setAttribute('aria-label', 'Hapus tugas: ' + t.teks);
    tombol.addEventListener('click', () => hapus(t.id));

    li.append(cek, teks, tombol);
    daftar.appendChild(li);
  });

  const sisa = tugas.filter((t) => !t.selesai).length;
  hitung.textContent = sisa + ' tugas tersisa';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const teks = input.value.trim();
  if (!teks) return;
  tambah(teks);
  input.value = '';
  input.focus();
});

tombolFilter.forEach((tombol) => {
  tombol.addEventListener('click', () => {
    filterAktif = tombol.dataset.filter;
    tombolFilter.forEach((b) => b.classList.toggle('aktif', b === tombol));
    render();
  });
});

tombolHapusSelesai.addEventListener('click', () => {
  tugas = tugas.filter((t) => !t.selesai);
  simpan();
  render();
});

render();
