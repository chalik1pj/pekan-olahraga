import bcrypt from "bcrypt";

const passwordPlain = 'passwordRahasia123!';
const saltRounds = 10;

bcrypt.hash(passwordPlain, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error saat hashing:', err);
    return;
  }

  console.log('Kata sandi asli:', passwordPlain);
  console.log('Hash yang dihasilkan:', hash);

  bcrypt.compare(passwordPlain, hash, (err, result) => {
    if (err) {
      console.error('Error saat verifikasi:', err);
      return;
    }

    if (result) {
      console.log('Verifikasi berhasil! Kata sandi cocok.');
    } else {
      console.log('Verifikasi gagal! Kata sandi tidak cocok.');
    }
  });
});