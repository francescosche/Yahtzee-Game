function tira_dadi() {
    num_tiri = parseInt($('#numero_tiri').html());

    switch(num_tiri) {
        case 0:
            break;
        case 1:
            estrai_dadi();
            $('#tira').parent().remove();
            aggiorna_tiri();
            break;
        case 2:
            estrai_dadi();
            aggiorna_tiri();
            break;
        case 3:
            crea_dadi();
            estrai_dadi();
            aggiorna_tiri();
            break;
    }
}

function aggiorna_tiri() {
    nn = num_tiri-1;
    $('#numero_tiri').html(nn);
}

function crea_dadi() {
    aggiungi_gioca();
    for(i=1; i<6; i++) {
        $('#dadi').html($('#dadi').html()+'<span class="dado" id="dado'+i+'" onclick="toggle_lock('+i+');"></span>');
    }
}

function estrai_dadi() {
    n_sbloccati = $('.dado:not([locked])').length;
    if(n_sbloccati == 0) {
        alert("Devi sbloccare almeno un dado");
    }else{
        for(i=1; i<n_sbloccati+1; i++) {
            num = Math.floor(Math.random() * (7-1) + 1);
            $('.dado:not([locked]):eq('+(i-1)+')').html(num);
        }
    }
}

function aggiungi_gioca() {
    $('#schema').append('<tr><td colspan="4" id="gioca" disabled>Gioca!</td></tr>');
}

function toggle_lock(i) {
    dado = $('#dado'+i);
    if(dado.is('[locked]')) {
        dado.removeAttr('locked');
    }else{
        dado.attr('locked','');
    }
}

function toggle_gioca() {
    if($('td[done="no"]').length > 0) {
        $('#gioca').removeAttr('disabled');
        $('#gioca').attr('class','button');
        $('#gioca').attr('onclick','play()');
    }else{
        $('#gioca').attr('disabled','');
        $('#gioca').attr('class','');
        $('#gioca').attr('onclick','');
    }
}

function play() {
    $('td[done="no"]').removeAttr('onclick');
    $('td[done="no"]').attr('style','cursor:default');
    $('td[done="no"]').attr('done','yes');
    $('#dadi').html('');
    $('#tira').parent().remove();
    $('#schema').append('<tr><td colspan="4" id="tira" class="button" onclick="tira_dadi();">Tira i dadi <span id="numero_tiri">3</span></td></tr>');
    $('#gioca').parent().remove();
    // TODO : Aggiungere calcolo del punteggio totale, da mostrare da qualche parte
}

function calcola_punti(e) {
    if($('.dado').length > 0) {
        m = $('td:nth-child(2n-1)').eq(e-1).html();
        dadi = ottieni_dadi();
        points = 0;
        switch(m) {
            case '63':
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
                for(var i = 0; i < dadi.length; ++i){
                    if(dadi[i] == m)
                        points++;
                }
                points = points*parseInt(m);
                break;
            case '3x':
                s = false;
                for(i=1; i<7; i++) if(count(dadi, i) >= 3 && !s) s = true;
                points = s ? somma_dadi(dadi) : 0;
                break;
            case '4x':
                s = false;
                for(i=1; i<7; i++) if(count(dadi, i) >= 4 && !s) s = true;
                points = s ? somma_dadi(dadi) : 0;
                break;
            case 'F':
                errore('devo ancora calcolare questo punteggio');
                break;
            case 'S':
                if(count(dadi,1)>0 && count(dadi,2)>0 && count(dadi,3)>0 && count(dadi,4)>0) points = 30;
                if(count(dadi,2)>0 && count(dadi,3)>0 && count(dadi,4)>0 && count(dadi,5)>0) points = 30;
                if(count(dadi,3)>0 && count(dadi,4)>0 && count(dadi,5)>0 && count(dadi,6)>0) points = 30;
                break;
            case 'B':
                if(count(dadi,1)>0 && count(dadi,2)>0 && count(dadi,3)>0 && count(dadi,4)>0 && count(dadi,5)>0) points = 40;
                if(count(dadi,2)>0 && count(dadi,3)>0 && count(dadi,4)>0 && count(dadi,5)>0 && count(dadi,6)>0) points = 40;
                break;
            case 'Y':
                for(i=1; i<7; i++) if(count(dadi, i) == 5) points = 50;
                break;
            case '?':
                points = somma_dadi(dadi);
                break;
        }
        if($('td[done="no"]').length > 0) {
            $('td[done="no"]').html('');
            $('td[done="no"]').removeAttr('done');
        }
        $('td:nth-child(2n)').eq(e-1).html(points);
        $('td:nth-child(2n)').eq(e-1).attr('done','no');
        toggle_gioca();
    }else{
        errore("Devi prima tirare i dadi!");
    }
}

function ottieni_dadi() {
    var dadi = [];
    for(i=0;i<5;i++) {
        v = $('.dado').eq(i).html();
        dadi.push(v);
    }
    return dadi;
}

function pagina_carica() {
    n = $('td:nth-child(2n)').length;
    for(i=0;i<n;i++) {
        $('td:nth-child(2n)').eq(i).attr('onclick', 'calcola_punti('+(i+1)+');');
    }
    $('#point_63').removeAttr('onclick');
}

function count(a, e) {
    c = 0;
    for(i=0; i<a.length; i++) {
        c = a[i] == e ? c+1 : c;
    }
    return c;
}

function somma_dadi(dadi) {
    t = 0;
    for(i=0;i<dadi.length;i++){
        t += parseInt(dadi[i]);
    }
    return t;
}

function errore(t) {
    alert(t);
}
