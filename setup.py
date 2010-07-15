from setuptools import setup, find_packages

setup(name='monster',
      version='0.1',
      description='Django backend for monster',
      author='Andrew Ingram',
      author_email='andy@andrewingram.net',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      )