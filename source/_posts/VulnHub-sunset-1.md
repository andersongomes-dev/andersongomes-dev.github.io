---
title: 'VulnHub sunset: 1'
date: 2019-08-04 00:00:00
tags:
cover: https://cdn-images-1.medium.com/max/800/1*NL99mutaA0_OEN_MTdEH1g.png
cover_creditos:
default_cover: https://cdn-images-1.medium.com/max/800/1*NL99mutaA0_OEN_MTdEH1g.png
excerpt: "Desafio CTF <strong><a href=''>VulnHub sunset: 1</a></strong> Realizado para aprendizado sobre conceitos de segurança da informação."
---


> _Alvo:_ **sunset (Linux Debian)** 
> _Atacante:_ **parrot** 4.19

### **Informações sobre o Alvo.**

Não foi há informação sobre o alvo.

### **Reconhecimento / Enumeração.**

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*NL99mutaA0_OEN_MTdEH1g.png" alt="">
      <figcaption></figcaption>
    </figure>

netdiscover

O ip do alvo é o 192.168.1.153

Usando “nmap” para lista portas e serviços e verificar se há alguma vulnerabilidade.

> nmap -sS -Pn -A -p- --script vuln 192.168.1.153

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*9pkw9sYXFuj2siRZ7M4BDA.png" alt="">
      <figcaption></figcaption>
    </figure>

sqlmap

Caso use a opção “-T4” do “nmap” ele mostrar que é possível fazer login com usuário anonymous no FTP.

> 21/tcp open ftp pyftpdlib 1.5.5   
> 22/tcp open ssh OpenSSH 7.9p1 Debian 10 (protocol 2.0)   
> 53/tcp filtered domain

**Analisando o serviço de FTP.**

Para se conectar ao FTP basta digitar o comando abaixo, no usuário digite “anonymous” e na senha digite “guest” ou deixe vazio.

> ftp 192.168.1.153

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*w6nvblUD_9bbJ1Ib1HsWuw.png" alt="">
      <figcaption></figcaption>
    </figure>

ftp

Há um arquivo chamado “backup” com permissões de leitura.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*og4Pll3nFxVfpAz9cVQvhQ.png" alt="">
      <figcaption></figcaption>
    </figure>

Baixando o arquivo

Apos baixar o arquivo e verificar o conteúdo, existe 5 possíveis usuários com suas hash de senha.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*8jgZiqC7YIkes1YJD5hzkw.png" alt="">
      <figcaption></figcaption>
    </figure>

hash

Agora só usar o [“john”](https://www.kali.org/tools/john/) para tentar descobrir a senha dos usuários.

> john backup  --wordlist=/usr/share/wordlists/rockyou.txt

3 senhas são descobertas rapidamente.

<figure class="image">
    <img src="https://cdn-images-1.medium.com/max/800/1*IsS3fmYkEdx2OZ-GqNRexw.png" alt="john">
    <figcaption>john</figcaption>
  </figure>

[john](https://www.kali.org/tools/john/)

Depois de conseguir acesso ao SSH, precisamos escalar privilegio para tornar-se root. Digitando “sudo -l” percebemos que os “/usr/bin/ed” está habilitado para uso e para escapar dele é tão fácil quanto parece.

<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*DXtUa7yxRXRoAAm9O6AYfw.png" alt="Escalando privilégios.">
  <figcaption>Escalando privilégios.</figcaption>
</figure>



Até a próxima.

