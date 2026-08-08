/**
 * Inline script that applies the persisted theme AND locale/direction
 * before React hydrates, preventing a flash of the wrong theme or a
 * layout jump when switching between LTR and RTL. Reads `pos-theme`
 * (falls back to system preference) and `pos-locale` (falls back to
 * Arabic, the app's default) from localStorage.
 */
export function ThemeScript() {
  const code = `(function(){
    try{
      var t=localStorage.getItem('pos-theme')||'system';
      var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('light',!d);
    }catch(e){}
    try{
      var loc=localStorage.getItem('pos-locale');
      loc=(loc==='ar'||loc==='en')?loc:'ar';
      document.documentElement.lang=loc;
      document.documentElement.dir=(loc==='ar')?'rtl':'ltr';
    }catch(e){}
  })();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
