<?php
namespace akiyatkin\utm;
class UTM {
	public static function parse($utms) {
		$utms = json_decode($utms, true);
		if (!is_array($utms)) $utms = [];
		$utms = array_reverse($utms);
		foreach ($utms as $k => $utm) {
			if (empty($utm['href'])) {
				unset($utms[$k]);
				continue;
			}
			$r = parse_url($utm['href']);
			if (!$r) {
				unset($utms[$k]);
				continue;
			}
			$utms[$k]['hrefpath'] = $r['path'];
			$utms[$k]['hrefquery'] = $r['query'];
		}
		foreach ($utms as $k => $utm) {
			if (empty($utm['referrer'])) {
				unset($utms[$k]);
				continue;
			}
			$ref = $utm['referrer'];
			$r = parse_url($ref);
			if (!$r) {
				unset($utms[$k]);
				continue;
			}
			$utms[$k]['referrerhost'] = $r['host'];
			if (empty($r['query'])) continue;
			parse_str($r['query'],$get);
			if (isset($get['q']) && is_string($get['q'])) {
				$utms[$k]['q'] = strip_tags($get['q']);
			}
		}
		return $utms;
	}
}