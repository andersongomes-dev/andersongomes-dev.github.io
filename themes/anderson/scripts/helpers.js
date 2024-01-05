'use strict';
const axios = require('axios');
const https = require('https');


 

hexo.extend.tag.register('youtube', function(args){
    var id = "mWNIvFHQk-U";                             
    return `<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
});

const formatDate = (dataStr) => {
    const data = new Date(dataStr);
    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const ano = data.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
}

const mokData = (data) => {
      return data.map(element => {
        return `<div class="column is-12">
        <div class="card post-card">
            <article class="card-content article" role="article">
                
                <h1 class="title is-3 is-size-4-mobile">
                    <a class="link-muted" href="${element.html_url}">
                        ${element.full_name}
                    </a>
                </h1>
                <div class="content"><p>
                ${element.description}
                </p>
                </div>
                <br>
                <div class="article-meta is-size-7 is-uppercase level is-mobile">
                    <div class="level-left">
                        <span class="level-item">
                            Criado: ${formatDate(element.created_at)}
                        </span>
                    </div>
                    <div class="level-left">
                    <span class="level-item">
                        Atualizado: ${formatDate(element.updated_at)}
                    </span>
                </div>
                </div>
            </article>
        </div>
    </div>`;
      });

}


hexo.extend.tag.register('minhaPromise', function(args){
    
    return new Promise((resolve) => {
        axios.get('https://api.github.com/users/andersongomes-dev/repos')
        .then(res => {
            let data = res.data;
            if(typeof(data) == typeof("string")){
                data = JSON.parse(data);
            }
            resolve(mokData(data));
        })
        .catch(err => {
            resolve(mokData([]));
            console.log('Error: ', err.message);
        });
        //setTimeout(() => { resolve(mokData()); }, 1000);
      });
},{async: true});


