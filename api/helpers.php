<?php

function seedDatabases($params, $props) {

   $params->set('product', ['basketball','candlesticks','carrier-pigeon','hairbrush','portable_grill','socks','soda_machine','tweezers','tutu','tea_bags']);
   $params->set('priority', ['1', '2', '3', '4', '5', '6']);
   $params->set('id', ['a1a2kk', 'a33kdd', 'aabd33k', 'bbke33','cc9d9c', 'e3f35k', 'f8d8sss']);
   $params->set('application_type', ['individual', 'corporation', 'couple', 'child']);
   $params->set('ccy', ['aud','cad','chf','eur','gbp','hkd','jpy','nzd','usd']);
   $params->set('locale', ['ar_AE','de_DE','el_GR','en_US','es_ES','fr_FR','it_IT','iw_IL','ja_JP','pl_PL','pt_BR','ru_RU','sv_SE','tr_TR','zh_CN','zh_TW']);
   $params->set('country', ['afghanistan','albania','algeria','american_samoa','andorra','angola','anguilla','antigua_and_barbuda','argentina','armenia','aruba','austria','azerbaijan','bahamas','bahrain','bangladesh','barbados','belgium','belize','benin','bermuda','bhutan','bolivia','bosnia_and_herzegovina','botswana','british_virgin_islands','brunei','bulgaria','burkina_faso','burundi','cambodia','cameroon','cape_verde_islands','cayman_islands','central_african_republic','chad','chile','china','colombia','comoros','costa_rica','croatia','cyprus','czech_republic','denmark','djibouti','dominica','dominican_republic','ecuador','egypt','el_salvador','equatorial_guinea','eritrea','estonia','ethiopia','falkland_islands','faroe_islands','fiji','finland','france','gabon','gambia','georgia','germany','ghana','gibraltar','greece','greenland','grenada','guam','guatemala','guinea','guinea','guyana','haiti','honduras','hungary','iceland','india','indonesia','iraq','ireland','isle_of_man','israel','italy','jamaica','jordan','kazakhstan','kenya','kiribati','kuwait','kyrgyzstan','laos','latvia','lebanon','lesotho','liechtenstein','lithuania','luxembourg','macao','macedonia','madagascar','malawi','malaysia','maldives','mali','malta','marshall','mauritania','mauritius','mexico','micronesia','moldova','monaco','mongolia','montenegro','morocco','mozambique','namibia','nauru','nepal','netherlands','netherlands_antilles','new_zealand','nicaragua','niger','nigeria','northern_mariana_islands','norway','oman','pakistan','palau','panama','papua_new_guinea','paraguay','peru','philippines','poland','portugal','puerto_rico','qatar','romania','russia','rwanda','saint_kitts_and_nevis','saint_lucia','saint_vincent','samoa','san_marino','sao_tome_and_principe','saudi_arabia','senegal','serbia','seychelles','sierra_leone','slovak_republic','slovenia','solomon_islands','south_africa','spain','sri_lanka','st_helena','suriname','swaziland','sweden','switzerland','taiwan','tajikistan','tanzania','thailand','togo','tonga','trinidad_and_tobago','tunisia','turkey','turkmenistan','turks_and_caicos','tuvalu','uganda','ukraine','united_arab_emirates','united_kingdom','united_states','uruguay','uzbekistan','vanuatu','venezuela','vietnam','virgin_islands_us','yemen','zambia']);
   $params->set('execution', ['return_first', 'return_last', 'in_first', 'out_first']);
   $params->set('platform', ['local', 'regional', 'global', 'sub-regional']);


   // // props
   $props->set('protocol', ['https', 'http']);
   $props->set('environment', [
   	'qa' => 'secure9x.fxcorporate.com/tr/',
   	'uat' => 'secure9z.fxcorporate.com/tr/',
   	'prod' => 'secure4.fxcorporate.com/tr/'
   ]);

}


 ?>
