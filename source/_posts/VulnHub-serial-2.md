---
title: 'VulnHub serial: 2'
excerpt: "Desafio CTF <strong><a href=''>VulnHub serial: 2</a></strong> Realizado para aprendizado sobre conceitos de segurança da informação."
date: 2019-10-19 17:08:44
tags:
cover: https://cdn-images-1.medium.com/max/800/1*EQvJsO6L-F3wxb35Af_-Fg.png
cover_creditos:
default_cover:
---


Hello friends.

#### Informações.

Serial 2 é uma maquina aparentemente fácil a parte mais difícil é para ganhar acesso root.

> Autor da máquina: sk4  
> Tipo de máquina: Linux  
> Nível da máquina: Intermediário


#### Reconhecimento.

Usei o netdiscover para descobrir qual era o ip da máquina alvo, e descobrimos que é 192.168.56.128.

#### Escaneando.

Ao realizar a varredura com nmap encontramos algumas portas abertas.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*EQvJsO6L-F3wxb35Af_-Fg.png" alt="">
      <figcaption></figcaption>
    </figure>

Escaneando porta no alvo.

Agora vamos escanear a aplicação web em busca alguma coisa importante.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*rwn5XgezLdtJKsBjkwM-tw.png" alt="">
      <figcaption></figcaption>
    </figure>

Escaneando com nmap

Escaneando o serviço que esta na porta 10000, encontramos um backdoor, mas infelizmente não temos a senha.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*hS2J3ev_ECuYdtOWHlbP9w.png" alt="">
      <figcaption></figcaption>
    </figure>

backdoor.

Acessando a página inicial da aplicação encontramos, um link para o serial2.apk .

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*Wy03He1oslxkFQ2NpmtqYA.png" alt="">
      <figcaption></figcaption>
    </figure>

pagina inicial da aplicação.

Agora vamos fazer uma rápida análise no apk e tentar descobrir alguma informação importante.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*1D1aBQtCgzM4YQ6Wy-5rCw.png" alt="">
      <figcaption></figcaption>
    </figure>

serial2.apk

No apk achamos um usuário e senha para ser usados na requisições da “/api”.  
Tem mais algumas pistas na página inicial, “/api/ip”, “/api/arp”, “/api/nmap”.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*gHTAMLppDsu4kicfupoaSQ.png" alt="">
      <figcaption></figcaption>
    </figure>

#### Ganhando acesso.

Depois de testar alguns request encontrei o uma forma de executar comandos, estamos dento da servidor.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*TXTXGEcsE1Tu4SK7MAXLFA.png" alt="">
      <figcaption></figcaption>
    </figure>

Depois de listar os arquivos executei outros comandos para coletar mais algumas informações.

**cat todo.txt =>** for user sk4: create a snapshot of the project!

> Já temos um usuário sk4.

**id** \=> uid=0(root) gid=0(root)

**ifconfig** => 172.17.0.2

> Somos root dentro de um container docker basta executar LinEnum.sh.

**git log**

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*ZY-f-CeciqqOwZSelmeGFA.png" alt="">
      <figcaption></figcaption>
    </figure>

A descrição do último commit indica que algumas chaves foram removida , então vamos executar um “git checkout <commit>” no commit anterior.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*oS1DJd6PLeCMQm0zRdb39Q.png" alt="">
      <figcaption></figcaption>
    </figure>

E lá estava nossa chave para acessar o servidor.  
depois de se login com o usuário e a chave encontrada obtemos nossa primeira flag.

> ssh -i id\_rsa sk4@192.168.56.128

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*MC5S5XLWTfjSoDDfUqBO3Q.png" alt="">
      <figcaption></figcaption>
    </figure>

Primeira flag.

Agora vamos explorar um binário, primeiro vamos checar se existe alguma proteção ativada.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*EN91ourt_gvTDb-WLxXqAg.png" alt="">
      <figcaption></figcaption>
    </figure>

Verificando as proteções ativas.

O binário possui uma proteção ativada NX ( _No eXecute_) isso significa que qualquer código que for armazenado na pilha não sera executado.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*mkN_r2SZNAPUUj52KIeC1Q.png" alt="">
      <figcaption></figcaption>
    </figure>

ASLR ativado

Outro ponto importante é que no nosso alvo o ASLR (Address space layout randomization) esta habilitado e isso dificulta um pouco nossa exploração, pois quando ela esta habilitada alguns endereços de memória são randômicos.

Pontos esclarecidos vamos continuar.   
 Precisamos descobrir a senha, então vamos colocar um breakpoint em algum ponto de comparação da senha.

> b \*login+184

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*YtUmfmLhLaEdJtHwceYB2g.png" alt="">
      <figcaption></figcaption>
    </figure>

pegando a senha.

A senha é **_j&9GCS34MY+^4ud\*_** agora precisamos provocar um erro no programa.

> python -c ‘print “A”\*72+”B”\*6’

Depois de enviar o payload gerado e depois digitar **_exit_** para sair do programa nossos “B” são exibidos como um endereço invalido.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*ZcN6ZChXOzQ_07RCV2BUWw.png" alt="">
      <figcaption></figcaption>
    </figure>

Mas isso não nos leva em lugar algum, precisamos executar algum comando **_system(“/bin/sh”)_** já é o suficiente.

Usaremos uma técnica chamada ROP (Return Oriented Programming).

> “A Programação Orientada a Retorno (ou ROP) é a idéia de encadear pequenos trechos de montagem com controle de pilha para fazer com que o programa faça coisas mais complexas.”

Para conseguir fazer o bypass no ASLR precisanmos vazar o endereço da GOT (Global Offset Table) para calcular em tempo de execução qual o endereço base da libc .   
 Vamos criar nosso código para a exploração.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*nIjRTbQy8P3dLG8iayIRMA.png" alt="">
      <figcaption></figcaption>
    </figure>

O código completo esta no link abaixo.

[https://raw.githubusercontent.com/andersongomes001/vulnhub/master/serial2/xpl.py](https://raw.githubusercontent.com/andersongomes001/vulnhub/master/serial2/xpl.py)

O teste feito na máquina local funcionava normalmente com o trecho do código abaixo, mas na máquina remota tive que repetir para a exploração ser bem sucedida.

p += p64(pop\_rdi\_ret)  
p += p64(binsh)  
p += p64(system)

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*2yjTMJ9hVq-Jc_tn83luHg.png" alt="">
      <figcaption></figcaption>
    </figure>

* * *

Fui o primeiro a resolver esta máquina e no final achei bem interessante esta exploração.

Até a próxima.
