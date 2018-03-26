for file in posts/**/index.md; do
  printf "$file\n$(cat $file | head -n 2)\n\n"
done