class RC4 {
  S = new Array(256);
  T = new Array(256);
  keylen = 0;

  constructor (password){
    var encoder = new TextEncoder();
    var key = encoder.encode(password);

    if (key.length < 1 || key.length > 256) {
      throw new Exception("key must be between 1 and 256 bytes");
    } else {
      this.keylen = key.length;
      for (let i = 0; i < 256; i++) {
        this.S[i] = i;
        this.T[i] = key[i % this.keylen];
      }
      let j = 0;
      let tmp;
      for (let i = 0; i < 256; i++) {
        j = (j + this.S[i] + this.T[i]) & 0xFF;
        tmp = this.S[j];
        this.S[j] = this.S[i];
        this.S[i] = tmp;
      }
    }
  }

  encrypt(plaintext) {
    let ciphertext = new Array(plaintext.length);
    let i = 0, j = 0, k, t;
    let tmp;
    for (let counter = 0; counter < plaintext.length; counter++) {
      i = (i + 1) & 0xFF;
      j = (j + this.S[i]) & 0xFF;

      tmp = this.S[j];
      this.S[j] = this.S[i];
      this.S[i] = tmp;
      t = (this.S[i] + this.S[j]) & 0xFF;
      k = this.S[t];
      ciphertext[counter] = plaintext[counter] ^ k;
    }
    return ciphertext;
  }

  decrypt(ciphertext) {
    return encrypt(ciphertext);
  }
}