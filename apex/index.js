(function () {
  'use strict';

  function visibleProjects(config) {
    const list = config && Array.isArray(config.projects) ? config.projects : [];
    return list.filter((p) => p && p.name && (p.url || p.subdomain) && !p.hide);
  }

  // Builds https://<subdomain>.<apex-domain>/ from the current host; on
  // localhost/IPs (no real apex domain) falls back to the relative `url`.
  function projectUrl(p, loc) {
    if (p.subdomain && loc && loc.hostname && /[a-z]/i.test(loc.hostname) && loc.hostname.includes('.')) {
      const apex = loc.hostname.replace(/^www\./, '');
      return loc.protocol + '//' + p.subdomain + '.' + apex + (loc.port ? ':' + loc.port : '') + '/';
    }
    return p.url || '#';
  }

  function render(projects) {
    const ul = document.getElementById('projects');
    const status = document.getElementById('status');
    ul.textContent = '';
    projects.forEach((p) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'card';
      a.href = projectUrl(p, window.location);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      const h = document.createElement('h2');
      h.textContent = p.name;
      const d = document.createElement('p');
      d.textContent = p.description || '';
      a.append(h, d);
      li.appendChild(a);
      ul.appendChild(li);
    });
    status.textContent = projects.length ? '' : 'No projects to show.';
  }

  if (typeof module !== 'undefined') module.exports = { visibleProjects, projectUrl };
  if (typeof document === 'undefined') return;

  fetch('projects.json')
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((c) => render(visibleProjects(c)))
    .catch(() => { document.getElementById('status').textContent = 'Could not load projects.'; });
})();
