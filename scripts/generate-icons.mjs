// Reproduz os ícones PNG originais com Pillow, sem baixar imagens ou fontes.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const publicDir = fileURLToPath(new URL('../public', import.meta.url));
const script = `
from PIL import Image, ImageDraw
from pathlib import Path
import sys
out = Path(sys.argv[1])
im = Image.new('RGB', (1024, 1024))
pix = im.load()
for y in range(1024):
    for x in range(1024):
        t = (x+y)/2048
        pix[x,y] = tuple(round(a+(b-a)*t) for a,b in zip((37,77,80),(16,41,44)))
d = ImageDraw.Draw(im)
ink, gold = '#e3e8df', '#d7b67e'
d.rounded_rectangle((348,268,676,756), radius=20, outline=ink, width=28)
d.line((452,314,572,314), fill=ink, width=18)
d.line((470,704,554,704), fill=ink, width=18)
d.ellipse((478,470,546,538), fill=gold)
d.arc((414,406,610,602), 145, 215, fill=gold, width=16)
d.arc((414,406,610,602), -35, 35, fill=gold, width=16)
for size,name in [(192,'icon-192.png'),(512,'icon-512.png'),(180,'apple-touch-icon.png')]:
    im.resize((size,size), Image.Resampling.LANCZOS).save(out/name, optimize=True)
`;
const result = spawnSync('python', ['-c', script, publicDir], { stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
